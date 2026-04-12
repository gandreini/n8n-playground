import { NextRequest, NextResponse } from "next/server"
import { createPrototype } from "@/lib/prototypes"

export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Prototype creation is only available in development" },
      { status: 403 }
    )
  }

  let body: {
    name?: string
    description?: string
    username?: string
    template?: string
    externalUrl?: string
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { name, description, username, template, externalUrl } = body

  if (!name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 })
  }

  if (!username?.trim()) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 })
  }

  try {
    const result = await createPrototype({
      name: name.trim(),
      description: description?.trim() || "",
      username: username.trim(),
      template,
      externalUrl,
    })

    return NextResponse.json({
      success: true,
      path: result.path,
      slug: result.slug,
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create prototype"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
