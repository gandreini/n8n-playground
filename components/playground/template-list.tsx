"use client"

import { useState } from "react"
import type { PrototypeEntry } from "@/lib/prototypes"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
    <div className="space-y-0">
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
        setOpen(false)
        setName("")
        window.location.href = data.path
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
              <DialogTitle>New prototype from {template.title}</DialogTitle>
            </DialogHeader>
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
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
