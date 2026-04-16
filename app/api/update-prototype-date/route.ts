import { NextRequest, NextResponse } from "next/server";
import { updatePrototypeDate } from "@/lib/prototypes";

export async function POST(request: NextRequest) {
    if (process.env.NODE_ENV !== "development") {
        return NextResponse.json(
            { error: "Only available in development" },
            { status: 403 },
        );
    }

    let body: { slug?: string; date?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Invalid JSON body" },
            { status: 400 },
        );
    }

    const { slug, date } = body;
    if (!slug?.trim() || !date?.trim()) {
        return NextResponse.json(
            { error: "slug and date are required" },
            { status: 400 },
        );
    }

    try {
        await updatePrototypeDate(slug.trim(), date.trim());
        return NextResponse.json({ success: true });
    } catch (e) {
        const message = e instanceof Error ? e.message : "Failed to update date";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
