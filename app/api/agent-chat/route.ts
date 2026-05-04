import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
    const webhookUrl = process.env.N8N_AGENT_WEBHOOK_URL;
    if (!webhookUrl) {
        return NextResponse.json(
            { error: "N8N_AGENT_WEBHOOK_URL is not configured" },
            { status: 500 }
        );
    }

    let body: { sessionId?: string; message?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { sessionId, message } = body;
    if (!sessionId || !message) {
        return NextResponse.json(
            { error: "sessionId and message are required" },
            { status: 400 }
        );
    }

    try {
        const upstream = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId, message }),
            signal: AbortSignal.timeout(55_000),
        });

        if (!upstream.ok) {
            const text = await upstream.text();
            return NextResponse.json(
                { error: `Upstream ${upstream.status}: ${text.slice(0, 500)}` },
                { status: 502 }
            );
        }

        const data = await upstream.json();
        const reply =
            typeof data?.reply === "string"
                ? data.reply
                : typeof data?.output === "string"
                  ? data.output
                  : typeof data === "string"
                    ? data
                    : null;

        if (!reply) {
            return NextResponse.json(
                { error: "Upstream returned no reply", raw: data },
                { status: 502 }
            );
        }

        return NextResponse.json({ reply });
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        return NextResponse.json({ error: msg }, { status: 502 });
    }
}
