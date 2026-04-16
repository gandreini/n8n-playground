import { NextRequest, NextResponse } from "next/server";
import { branchPrototype } from "@/lib/prototypes";

export async function POST(request: NextRequest) {
    if (process.env.NODE_ENV !== "development") {
        return NextResponse.json(
            { error: "Only available in development" },
            { status: 403 },
        );
    }

    let body: { sourceSlug?: string; name?: string; username?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Invalid JSON body" },
            { status: 400 },
        );
    }

    const { sourceSlug, name, username } = body;
    if (!sourceSlug?.trim() || !name?.trim() || !username?.trim()) {
        return NextResponse.json(
            { error: "sourceSlug, name, and username are required" },
            { status: 400 },
        );
    }

    try {
        const result = await branchPrototype({
            sourceSlug: sourceSlug.trim(),
            name: name.trim(),
            username: username.trim(),
        });
        return NextResponse.json({
            success: true,
            path: result.path,
            slug: result.slug,
        });
    } catch (e) {
        const message = e instanceof Error ? e.message : "Failed to branch";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
