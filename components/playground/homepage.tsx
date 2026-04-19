"use client";

import { useState } from "react";
import {
    Search,
    Plus,
    ExternalLink as ExternalLinkIcon,
    CheckCircle2,
} from "lucide-react";
import { N8nLogo } from "@/components/n8n/shared/n8n-logo";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/shadcn/tabs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/shadcn/dialog";
import { Button } from "@/components/shadcn/button";
import { N8nButton } from "@/components/n8n/shared/button";
import { Input } from "@/components/shadcn/input";
import { Textarea } from "@/components/shadcn/textarea";
import { Label } from "@/components/shadcn/label";
import { PrototypeList } from "./prototype-list";
import { VisionList } from "./vision-list";
import { TemplateList } from "./template-list";
import { ComponentList } from "./component-list";
import type { PrototypeEntry, ComponentEntry } from "@/lib/prototypes";

interface HomepageProps {
    prototypes: PrototypeEntry[];
    templates: PrototypeEntry[];
    components: ComponentEntry[];
    isDev: boolean;
}

export function Homepage({
    prototypes,
    templates,
    components,
    isDev,
}: HomepageProps) {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="playground-homepage">
            <div className="container">
                <div className="header">
                    <N8nLogo size={32} />
                    <h1>n8n Playground</h1>
                </div>

                <div className="toolbar">
                    <div className="search">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search prototypes, templates, components..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    {isDev && (
                        <div className="actions">
                            <NewPrototypeDialog />
                            <LinkExternalDialog />
                        </div>
                    )}
                </div>

                <Tabs defaultValue="vision">
                    <TabsList style={{ marginBottom: "var(--spacing--lg)" }}>
                        <TabsTrigger value="vision">Vision</TabsTrigger>
                        <TabsTrigger value="prototypes">Prototypes</TabsTrigger>
                        <TabsTrigger value="templates">Templates</TabsTrigger>
                        <TabsTrigger value="components">Components</TabsTrigger>
                    </TabsList>

                    <TabsContent value="vision">
                        <VisionList
                            prototypes={prototypes}
                            searchQuery={searchQuery}
                            isDev={isDev}
                        />
                    </TabsContent>

                    <TabsContent value="prototypes">
                        <PrototypeList
                            prototypes={prototypes}
                            searchQuery={searchQuery}
                            isDev={isDev}
                        />
                    </TabsContent>

                    <TabsContent value="templates">
                        <TemplateList
                            templates={templates}
                            searchQuery={searchQuery}
                            isDev={isDev}
                        />
                    </TabsContent>

                    <TabsContent value="components">
                        <ComponentList
                            components={components}
                            searchQuery={searchQuery}
                        />
                    </TabsContent>
                </Tabs>
            </div>

            <style jsx>{`
                .playground-homepage {
                    min-height: 100vh;
                    background-color: var(--color--neutral-white);
                }
                .container {
                    max-width: 72rem;
                    margin-inline: auto;
                    padding: var(--spacing--2xl) var(--spacing--lg);
                }
                .header {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--xs);
                    margin-bottom: var(--spacing--xl);
                }
                .header h1 {
                    font-size: var(--font-size--xl);
                    font-weight: var(--font-weight--semibold);
                    color: var(--color--neutral-800);
                }
                .toolbar {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--xs);
                    margin-bottom: var(--spacing--lg);
                }
                .search {
                    position: relative;
                    flex: 1;
                }
                .search :global(.search-icon) {
                    position: absolute;
                    left: var(--spacing--xs);
                    top: 50%;
                    transform: translateY(-50%);
                    width: 16px;
                    height: 16px;
                    color: var(--color--neutral-300);
                }
                .search-input {
                    width: 100%;
                    padding: var(--spacing--2xs) var(--spacing--sm) var(--spacing--2xs) 2.5rem;
                    font-size: var(--font-size--sm);
                    border: 1px solid var(--color--neutral-150);
                    border-radius: var(--radius--sm);
                    background-color: var(--color--neutral-white);
                    color: var(--color--neutral-800);
                    transition: border-color var(--duration--snappy) var(--easing--ease-out);
                }
                .search-input::placeholder {
                    color: var(--color--neutral-300);
                }
                .search-input:focus {
                    outline: none;
                    border-color: var(--color--orange-300);
                }
                .actions {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--2xs);
                }
            `}</style>
        </div>
    );
}

function NewPrototypeDialog() {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [username, setUsername] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("playground-username") || "";
        }
        return "";
    });
    const [template, setTemplate] = useState("blank");
    const [loading, setLoading] = useState(false);
    const [created, setCreated] = useState<{ path: string } | null>(null);

    async function handleCreate() {
        if (!name.trim() || !username.trim()) return;
        setLoading(true);

        localStorage.setItem("playground-username", username);

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
            });

            if (res.ok) {
                const data = await res.json();
                setCreated({ path: data.path });
                setName("");
                setDescription("");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <N8nButton size="small" icon={<Plus style={{ width: 16, height: 16 }} />}>
                    New
                </N8nButton>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {created ? "Prototype created!" : "New prototype"}
                    </DialogTitle>
                </DialogHeader>
                {created ? (
                    <div className="form">
                        <div className="success-box">
                            <CheckCircle2 className="success-icon" />
                            <div>
                                <p className="success-title">
                                    Files created at{" "}
                                    <code>{created.path}</code>
                                </p>
                                <p className="success-sub">
                                    Restart the dev server to see the new route,
                                    then navigate to your prototype.
                                </p>
                            </div>
                        </div>
                        <div className="path-box">
                            <p className="path-label">
                                # Restart dev server, then open:
                            </p>
                            <p>http://localhost:3000{created.path}</p>
                        </div>
                        <Button
                            onClick={() => {
                                setCreated(null);
                                setOpen(false);
                            }}
                            variant="outline"
                            className="w-full"
                        >
                            Done
                        </Button>
                    </div>
                ) : (
                    <div className="form">
                        <div className="field">
                            <Label htmlFor="new-username">Username</Label>
                            <Input
                                id="new-username"
                                placeholder="your-username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="field">
                            <Label htmlFor="new-name">Prototype name</Label>
                            <Input
                                id="new-name"
                                placeholder="my-cool-prototype"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="field">
                            <Label htmlFor="new-description">Description</Label>
                            <Textarea
                                id="new-description"
                                placeholder="What are you prototyping?"
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="field">
                            <Label htmlFor="new-template">Template</Label>
                            <select
                                id="new-template"
                                value={template}
                                onChange={(e) => setTemplate(e.target.value)}
                                className="select"
                            >
                                <option value="blank">Blank</option>
                                <option value="n8n-app">n8n App Shell</option>
                                <option value="workflow-editor">
                                    Workflow Editor
                                </option>
                            </select>
                        </div>
                        <Button
                            onClick={handleCreate}
                            disabled={
                                !name.trim() || !username.trim() || loading
                            }
                            className="w-full"
                        >
                            {loading ? "Creating..." : "Create prototype"}
                        </Button>
                    </div>
                )}

                <style jsx>{`
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
                    .success-box :global(.success-icon) {
                        width: 20px;
                        height: 20px;
                        color: var(--color--green-600);
                        flex-shrink: 0;
                        margin-top: 2px;
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
                    .select {
                        width: 100%;
                        padding: var(--spacing--2xs) var(--spacing--xs);
                        font-size: var(--font-size--sm);
                        border: 1px solid var(--color--neutral-150);
                        border-radius: var(--radius--sm);
                        background-color: var(--color--neutral-white);
                        color: var(--color--neutral-800);
                    }
                    .select:focus {
                        outline: none;
                        border-color: var(--color--orange-300);
                    }
                `}</style>
            </DialogContent>
        </Dialog>
    );
}

function LinkExternalDialog() {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [url, setUrl] = useState("");
    const [username, setUsername] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("playground-username") || "";
        }
        return "";
    });
    const [loading, setLoading] = useState(false);

    async function handleLink() {
        if (!name.trim() || !username.trim() || !url.trim()) return;
        setLoading(true);

        localStorage.setItem("playground-username", username);

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
            });

            if (res.ok) {
                setOpen(false);
                setName("");
                setDescription("");
                setUrl("");
                window.location.reload();
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <N8nButton
                    variant="subtle"
                    size="small"
                    icon={<ExternalLinkIcon style={{ width: 16, height: 16 }} />}
                >
                    Link external
                </N8nButton>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Link external prototype</DialogTitle>
                </DialogHeader>
                <div className="form">
                    <div className="field">
                        <Label htmlFor="ext-username">Username</Label>
                        <Input
                            id="ext-username"
                            placeholder="your-username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="field">
                        <Label htmlFor="ext-name">Prototype name</Label>
                        <Input
                            id="ext-name"
                            placeholder="Chat Interface Exploration"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="field">
                        <Label htmlFor="ext-description">Description</Label>
                        <Textarea
                            id="ext-description"
                            placeholder="Built in v0"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="field">
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
                        disabled={
                            !name.trim() ||
                            !username.trim() ||
                            !url.trim() ||
                            loading
                        }
                        className="w-full"
                    >
                        {loading ? "Linking..." : "Link prototype"}
                    </Button>
                </div>

                <style jsx>{`
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
                `}</style>
            </DialogContent>
        </Dialog>
    );
}
