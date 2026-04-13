"use client"

import { useState } from "react"
import { Search, Plus, ExternalLink as ExternalLinkIcon, CheckCircle2 } from "lucide-react"
import { N8nLogo } from "@/components/n8n/shared/n8n-logo"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { N8nButton } from "@/components/n8n/shared/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PrototypeList } from "./prototype-list"
import { VisionList } from "./vision-list"
import { TemplateList } from "./template-list"
import { ComponentList } from "./component-list"
import type { PrototypeEntry, ComponentEntry } from "@/lib/prototypes"

interface HomepageProps {
  prototypes: PrototypeEntry[]
  templates: PrototypeEntry[]
  components: ComponentEntry[]
  isDev: boolean
}

export function Homepage({ prototypes, templates, components, isDev }: HomepageProps) {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="playground-homepage min-h-screen bg-[var(--color--neutral-white)]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <N8nLogo size={32} />
          <h1 className="text-xl font-semibold text-[var(--color--neutral-800)]">
            n8n Playground
          </h1>
        </div>

        {/* Search + Actions */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color--neutral-300)]" />
            <input
              type="text"
              placeholder="Search prototypes, templates, components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-[var(--color--neutral-150)] rounded-[var(--radius--sm)] bg-[var(--color--neutral-white)] text-[var(--color--neutral-800)] placeholder:text-[var(--color--neutral-300)] focus:outline-none focus:border-[var(--color--orange-300)] transition-colors"
            />
          </div>
          {isDev && (
            <div className="flex items-center gap-2">
              <NewPrototypeDialog />
              <LinkExternalDialog />
            </div>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="prototypes">
          <TabsList className="mb-6">
            <TabsTrigger value="prototypes">Prototypes</TabsTrigger>
            <TabsTrigger value="vision">Vision</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
          </TabsList>

          <TabsContent value="prototypes">
            <PrototypeList prototypes={prototypes} searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="vision">
            <VisionList prototypes={prototypes} searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="templates">
            <TemplateList templates={templates} searchQuery={searchQuery} isDev={isDev} />
          </TabsContent>

          <TabsContent value="components">
            <ComponentList components={components} searchQuery={searchQuery} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function NewPrototypeDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [username, setUsername] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("playground-username") || ""
    }
    return ""
  })
  const [template, setTemplate] = useState("blank")
  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState<{ path: string } | null>(null)

  async function handleCreate() {
    if (!name.trim() || !username.trim()) return
    setLoading(true)

    localStorage.setItem("playground-username", username)

    try {
      const res = await fetch("/api/create-prototype", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          username: username.trim(),
          template,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setCreated({ path: data.path })
        setName("")
        setDescription("")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <N8nButton size="small" icon={<Plus className="w-4 h-4" />}>
          New
        </N8nButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{created ? "Prototype created!" : "New prototype"}</DialogTitle>
        </DialogHeader>
        {created ? (
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3 p-4 rounded-[var(--radius--xs)] bg-[var(--color--green-50)] border border-[var(--color--green-200)]">
              <CheckCircle2 className="w-5 h-5 text-[var(--color--green-600)] shrink-0 mt-0.5" />
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
            <Label htmlFor="new-username">Username</Label>
            <Input
              id="new-username"
              placeholder="your-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-name">Prototype name</Label>
            <Input
              id="new-name"
              placeholder="my-cool-prototype"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-description">Description</Label>
            <Input
              id="new-description"
              placeholder="What are you prototyping?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-template">Template</Label>
            <select
              id="new-template"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[var(--color--neutral-150)] rounded-[var(--radius--sm)] bg-[var(--color--neutral-white)] text-[var(--color--neutral-800)] focus:outline-none focus:border-[var(--color--orange-300)]"
            >
              <option value="blank">Blank</option>
              <option value="n8n-app">n8n App Shell</option>
            </select>
          </div>
          <Button
            onClick={handleCreate}
            disabled={!name.trim() || !username.trim() || loading}
            className="w-full"
          >
            {loading ? "Creating..." : "Create prototype"}
          </Button>
        </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function LinkExternalDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [url, setUrl] = useState("")
  const [username, setUsername] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("playground-username") || ""
    }
    return ""
  })
  const [loading, setLoading] = useState(false)

  async function handleLink() {
    if (!name.trim() || !username.trim() || !url.trim()) return
    setLoading(true)

    localStorage.setItem("playground-username", username)

    try {
      const res = await fetch("/api/create-prototype", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          username: username.trim(),
          externalUrl: url.trim(),
        }),
      })

      if (res.ok) {
        setOpen(false)
        setName("")
        setDescription("")
        setUrl("")
        window.location.reload()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <N8nButton variant="subtle" size="small" icon={<ExternalLinkIcon className="w-4 h-4" />}>
          Link external
        </N8nButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Link external prototype</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="ext-username">Username</Label>
            <Input
              id="ext-username"
              placeholder="your-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ext-name">Prototype name</Label>
            <Input
              id="ext-name"
              placeholder="Chat Interface Exploration"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ext-description">Description</Label>
            <Input
              id="ext-description"
              placeholder="Built in v0"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ext-url">URL</Label>
            <Input
              id="ext-url"
              placeholder="https://v0.dev/chat/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <Button
            onClick={handleLink}
            disabled={!name.trim() || !username.trim() || !url.trim() || loading}
            className="w-full"
          >
            {loading ? "Linking..." : "Link prototype"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
