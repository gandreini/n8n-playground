"use client";

import { useCallback, useRef, useState } from "react";

export interface ChatMessage {
    id: string;
    role: "agent" | "user";
    content: string;
    pending?: boolean;
    toolActivity?: string[];
}

interface SendOptions {
    message: string;
}

interface AnthropicEvent {
    type: string;
    // Free-form — Anthropic event shapes vary by type.
    [key: string]: unknown;
}

function newId() {
    return Math.random().toString(36).slice(2, 10);
}

export function usePulseChat(initialMessages: ChatMessage[] = []) {
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const sessionIdRef = useRef<string | null>(null);

    const send = useCallback(async ({ message }: SendOptions) => {
        setError(null);

        const userMsg: ChatMessage = {
            id: newId(),
            role: "user",
            content: message,
        };
        const agentMsgId = newId();
        const agentMsg: ChatMessage = {
            id: agentMsgId,
            role: "agent",
            content: "",
            pending: true,
            toolActivity: [],
        };

        setMessages((prev) => [...prev, userMsg, agentMsg]);
        setIsStreaming(true);

        const appendAgentText = (text: string) =>
            setMessages((prev) =>
                prev.map((m) =>
                    m.id === agentMsgId
                        ? { ...m, content: m.content + text }
                        : m,
                ),
            );
        const addToolActivity = (label: string) =>
            setMessages((prev) =>
                prev.map((m) =>
                    m.id === agentMsgId
                        ? {
                              ...m,
                              toolActivity: [...(m.toolActivity ?? []), label],
                          }
                        : m,
                ),
            );
        const finishAgent = () =>
            setMessages((prev) =>
                prev.map((m) =>
                    m.id === agentMsgId ? { ...m, pending: false } : m,
                ),
            );

        try {
            const response = await fetch(
                "/prototypes/giulio/n8n-pulse/api/chat",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        message,
                        sessionId: sessionIdRef.current,
                    }),
                },
            );

            if (!response.ok || !response.body) {
                const errText = await response.text().catch(() => "");
                throw new Error(
                    `Request failed (${response.status}): ${errText || "no body"}`,
                );
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });

                let idx;
                while ((idx = buffer.indexOf("\n\n")) !== -1) {
                    const chunk = buffer.slice(0, idx);
                    buffer = buffer.slice(idx + 2);
                    if (!chunk.startsWith("data:")) continue;
                    const json = chunk.slice(5).trim();
                    if (!json) continue;

                    let event: AnthropicEvent;
                    try {
                        event = JSON.parse(json);
                    } catch {
                        continue;
                    }

                    handleEvent(event, {
                        onText: appendAgentText,
                        onTool: addToolActivity,
                        onSession: (id) => (sessionIdRef.current = id),
                    });
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            finishAgent();
            setIsStreaming(false);
        }
    }, []);

    return { messages, send, isStreaming, error };
}

function handleEvent(
    event: AnthropicEvent,
    handlers: {
        onText: (text: string) => void;
        onTool: (label: string) => void;
        onSession: (id: string) => void;
    },
) {
    switch (event.type) {
        case "session.ready": {
            const id = event.sessionId;
            if (typeof id === "string") handlers.onSession(id);
            break;
        }
        case "agent.message": {
            const content = event.content as
                | Array<{ type: string; text?: string }>
                | undefined;
            if (!content) return;
            for (const block of content) {
                if (block.type === "text" && block.text) {
                    handlers.onText(block.text);
                }
            }
            break;
        }
        case "agent.tool_use":
        case "agent.mcp_tool_use": {
            const name =
                (event.name as string | undefined) ??
                (event.tool_name as string | undefined) ??
                "tool";
            handlers.onTool(`Using ${name}`);
            break;
        }
        case "agent.custom_tool_use": {
            const name = (event.tool_name as string | undefined) ?? "custom tool";
            handlers.onTool(`Custom tool: ${name}`);
            break;
        }
        case "error": {
            const message = event.message;
            if (typeof message === "string") {
                handlers.onText(`\n[error: ${message}]`);
            }
            break;
        }
    }
}
