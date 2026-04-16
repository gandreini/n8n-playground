import { NextRequest, NextResponse } from "next/server";
import { setPrototypeFeatured } from "@/lib/prototypes";

export async function POST(request: NextRequest) {
    if (process.env.NODE_ENV !== "development") {
        return NextResponse.json(
            { error: "Only available in development" },
            { status: 403 },
        );
    }

    let body: { slug?: string; featured?: boolean };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Invalid JSON body" },
            { status: 400 },
        );
    }

    const { slug, featured } = body;
    if (!slug?.trim() || typeof featured !== "boolean") {
        return NextResponse.json(
            { error: "slug and featured (boolean) are required" },
            { status: 400 },
        );
    }

    try {
        await setPrototypeFeatured(slug.trim(), featured);
        return NextResponse.json({ success: true });
    } catch (e) {
        const message = e instanceof Error ? e.message : "Failed to update featured";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
