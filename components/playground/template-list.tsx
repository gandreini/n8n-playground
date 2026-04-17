"use client"

import { useState } from "react"
import type { PrototypeEntry } from "@/lib/prototypes"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/dialog"
import { Button } from "@/components/shadcn/button"
import { Input } from "@/components/shadcn/input"
import { Label } from "@/components/shadcn/label"

interface TemplateListProps {
  templates: PrototypeEntry[]
  searchQuery: string
  isDev: boolean
}

export function TemplateList({ templates, searchQuery, isDev }: TemplateListProps) {
  const filtered = searchQuery.trim()
    ? templates.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : templates

  if (filtered.length === 0) {
    return (
      <p className="text-[var(--color--neutral-400)] text-sm py-8">
        No templates found.
      </p>
    )
  }

  return (
    <div className="playground-template-list space-y-0">
      {filtered.map((template) => (
        <TemplateRow key={template.slug} template={template} isDev={isDev} />
      ))}
    </div>
  )
}

function TemplateRow({ template, isDev }: { template: PrototypeEntry; isDev: boolean }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [username, setUsername] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("playground-username") || ""
    }
    return ""
  })
  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState<{ path: string } | null>(null)

  const templateSlug = template.slug.replace("_templates/", "")

  async function handleUseTemplate() {
    if (!name.trim() || !username.trim()) return
    setLoading(true)

    localStorage.setItem("playground-username", username)

    try {
      const res = await fetch("/api/create-prototype", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: `Created from ${template.title} template`,
          username: username.trim(),
          template: templateSlug,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setCreated({ path: data.path })
        setName("")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3 px-3 py-2.5 -mx-3 rounded-[var(--radius--xs)] hover:bg-[var(--color--neutral-50)] transition-colors">
      <div className="flex-1">
        <span className="text-sm text-[var(--color--neutral-800)]">
          {template.title}
        </span>
        <span className="text-[var(--font-size--2xs)] text-[var(--color--neutral-400)] ml-3">
          {template.description}
        </span>
      </div>
      {isDev && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-xs text-[var(--color--neutral-500)] hover:text-[var(--color--orange-500)]">
              Use this template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{created ? "Prototype created!" : `New prototype from ${template.title}`}</DialogTitle>
            </DialogHeader>
            {created ? (
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3 p-4 rounded-[var(--radius--xs)] bg-[var(--color--green-50)] border border-[var(--color--green-200)]">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-[var(--color--neutral-800)]">Files created at <code className="text-xs bg-[var(--color--neutral-125)] px-1 py-0.5 rounded">{created.path}</code></p>
                    <p className="text-xs text-[var(--color--neutral-500)]">Restart the dev server to see the new route, then navigate to your prototype.</p>
                  </div>
                </div>
                <div className="p-3 rounded-[var(--radius--xs)] bg-[var(--color--neutral-50)] border border-[var(--color--neutral-150)] font-mono text-xs text-[var(--color--neutral-700)]">
                  <p className="text-[var(--color--neutral-400)] mb-1"># Restart dev server, then open:</p>
                  <p>http://localhost:3000{created.path}</p>
                </div>
                <Button onClick={() => { setCreated(null); setOpen(false) }} variant="outline" className="w-full">
                  Done
                </Button>
              </div>
            ) : (
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="template-username">Username</Label>
                <Input
                  id="template-username"
                  placeholder="your-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="template-name">Prototype name</Label>
                <Input
                  id="template-name"
                  placeholder="my-cool-prototype"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <Button
                onClick={handleUseTemplate}
                disabled={!name.trim() || !username.trim() || loading}
                className="w-full"
              >
                {loading ? "Creating..." : "Create prototype"}
              </Button>
            </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
