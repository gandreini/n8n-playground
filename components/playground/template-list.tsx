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
      <p className="empty">
        No templates found.

        <style jsx>{`
          .empty {
            color: var(--color--neutral-400);
            font-size: var(--font-size--sm);
            padding-block: var(--spacing--xl);
          }
        `}</style>
      </p>
    )
  }

  return (
    <div className="playground-template-list">
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
    <div className="row">
      <div className="meta">
        <span className="title">{template.title}</span>
        <span className="description">{template.description}</span>
      </div>
      {isDev && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="use-template-btn text-xs">
              Use this template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{created ? "Prototype created!" : `New prototype from ${template.title}`}</DialogTitle>
            </DialogHeader>
            {created ? (
              <div className="form">
                <div className="success-box">
                  <div>
                    <p className="success-title">
                      Files created at <code>{created.path}</code>
                    </p>
                    <p className="success-sub">
                      Restart the dev server to see the new route, then navigate to your prototype.
                    </p>
                  </div>
                </div>
                <div className="path-box">
                  <p className="path-label"># Restart dev server, then open:</p>
                  <p>http://localhost:3000{created.path}</p>
                </div>
                <Button onClick={() => { setCreated(null); setOpen(false) }} variant="outline" className="w-full">
                  Done
                </Button>
              </div>
            ) : (
              <div className="form">
                <div className="field">
                  <Label htmlFor="template-username">Username</Label>
                  <Input
                    id="template-username"
                    placeholder="your-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="field">
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

      <style jsx>{`
        .row {
          display: flex;
          align-items: center;
          gap: var(--spacing--xs);
          padding: 10px var(--spacing--xs);
          margin-inline: calc(var(--spacing--xs) * -1);
          border-radius: var(--radius--xs);
          transition: background-color var(--duration--snappy) var(--easing--ease-out);
        }
        .row:hover {
          background-color: var(--color--neutral-50);
        }
        .meta {
          flex: 1;
        }
        .title {
          font-size: var(--font-size--sm);
          color: var(--color--neutral-800);
        }
        .description {
          font-size: var(--font-size--2xs);
          color: var(--color--neutral-400);
          margin-left: var(--spacing--xs);
        }
        .form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing--sm);
          padding-top: var(--spacing--2xs);
        }
        .field {
          display: flex;
          flex-direction: column;
          gap: var(--spacing--2xs);
        }
        .success-box {
          display: flex;
          align-items: flex-start;
          gap: var(--spacing--xs);
          padding: var(--spacing--sm);
          border-radius: var(--radius--xs);
          background-color: var(--color--green-50);
          border: 1px solid var(--color--green-200);
        }
        .success-title {
          font-size: var(--font-size--sm);
          font-weight: var(--font-weight--medium);
          color: var(--color--neutral-800);
          margin-bottom: var(--spacing--4xs);
        }
        .success-title code {
          font-size: var(--font-size--2xs);
          background-color: var(--color--neutral-125);
          padding: 2px var(--spacing--4xs);
          border-radius: var(--radius--3xs);
        }
        .success-sub {
          font-size: var(--font-size--2xs);
          color: var(--color--neutral-500);
        }
        .path-box {
          padding: var(--spacing--xs);
          border-radius: var(--radius--xs);
          background-color: var(--color--neutral-50);
          border: 1px solid var(--color--neutral-150);
          font-family: var(--font-mono);
          font-size: var(--font-size--2xs);
          color: var(--color--neutral-700);
        }
        .path-label {
          color: var(--color--neutral-400);
          margin-bottom: var(--spacing--4xs);
        }
        :global(.use-template-btn) {
          color: var(--color--neutral-500);
        }
        :global(.use-template-btn:hover) {
          color: var(--color--orange-500);
        }
      `}</style>
    </div>
  )
}
