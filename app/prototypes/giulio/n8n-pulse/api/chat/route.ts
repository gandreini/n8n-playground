import Anthropic from "@anthropic-ai/sdk";
import { AGENT_ID, ENVIRONMENT_ID } from "../../config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

interface ChatRequest {
    message: string;
    sessionId?: string;
}

export async function POST(request: Request) {
    if (!process.env.ANTHROPIC_API_KEY) {
        return Response.json(
            { error: "ANTHROPIC_API_KEY is not set. Add it to .env.local." },
            { status: 500 },
        );
    }

    let body: ChatRequest;
    try {
        body = await request.json();
    } catch {
        return Response.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const { message, sessionId: existingSessionId } = body;
    if (!message || typeof message !== "string") {
        return Response.json(
            { error: "`message` is required." },
            { status: 400 },
        );
    }

    const client = new Anthropic();

    let sessionId = existingSessionId;
    if (!sessionId) {
        try {
            const session = await client.beta.sessions.create({
                agent: AGENT_ID,
                environment_id: ENVIRONMENT_ID,
            });
            sessionId = session.id;
        } catch (err) {
            return Response.json(
                {
                    error: "Failed to create session",
                    detail: String(err),
                },
                { status: 500 },
            );
        }
    }

    const encoder = new TextEncoder();
    const write = (controller: ReadableStreamDefaultController, data: unknown) =>
        controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(data)}\n\n`),
        );

    const readable = new ReadableStream({
        async start(controller) {
            write(controller, { type: "session.ready", sessionId });

            try {
                const stream = await client.beta.sessions.events.stream(
                    sessionId!,
                );

                await client.beta.sessions.events.send(sessionId!, {
                    events: [
                        {
                            type: "user.message",
                            content: [{ type: "text", text: message }],
                        },
                    ],
                });

                for await (const event of stream) {
                    write(controller, event);

                    if (event.type === "session.status_terminated") break;
                    if (
                        event.type === "session.status_idle" &&
                        event.stop_reason?.type !== "requires_action"
                    ) {
                        break;
                    }
                }
            } catch (err) {
                write(controller, { type: "error", message: String(err) });
            } finally {
                write(controller, { type: "done" });
                controller.close();
            }
        },
    });

    return new Response(readable, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
        },
    });
}
