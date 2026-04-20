"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ExternalLink,
    MoreHorizontal,
    CalendarDays,
    GitBranch,
    CheckCircle2,
    Star,
} from "lucide-react";
import { format, isThisMonth, isThisYear } from "date-fns";
import type { PrototypeEntry } from "@/lib/prototypes";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn/popover";
import { Calendar } from "@/components/shadcn/calendar";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/shadcn/dialog";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";

interface PrototypeListProps {
    prototypes: PrototypeEntry[];
    searchQuery: string;
    isDev?: boolean;
}

function groupByMonth(
    entries: PrototypeEntry[],
): Record<string, PrototypeEntry[]> {
    const groups: Record<string, PrototypeEntry[]> = {};

    for (const entry of entries) {
        if (!entry.date) {
            const key = "Undated";
            if (!groups[key]) groups[key] = [];
            groups[key].push(entry);
            continue;
        }

        const date = new Date(entry.date + "T00:00:00");
        let key: string;
        if (isThisMonth(date)) {
            key = "This month";
        } else if (isThisYear(date)) {
            key = format(date, "MMMM");
        } else {
            key = format(date, "MMMM yyyy");
        }

        if (!groups[key]) groups[key] = [];
        groups[key].push(entry);
    }

    return groups;
}

function filterEntries(
    entries: PrototypeEntry[],
    query: string,
): PrototypeEntry[] {
    if (!query.trim()) return entries;
    const q = query.toLowerCase();
    return entries.filter(
        (e) =>
            e.title.toLowerCase().includes(q) ||
            e.author.toLowerCase().includes(q) ||
            e.description.toLowerCase().includes(q),
    );
}

export function PrototypeList({
    prototypes,
    searchQuery,
    isDev = false,
}: PrototypeListProps) {
    const filtered = filterEntries(
        prototypes.filter((p) => !p.template),
        searchQuery,
    );
    const groups = groupByMonth(filtered);

    if (filtered.length === 0) {
        return (
            <p className="empty">
                No prototypes found.

                <style jsx>{`
                    .empty {
                        color: var(--color--neutral-400);
                        font-size: var(--font-size--sm);
                        padding-block: var(--spacing--xl);
                    }
                `}</style>
            </p>
        );
    }

    return (
        <div className="playground-prototype-list">
            {Object.entries(groups).map(([month, entries]) => (
                <div key={month} className="group">
                    <h3>{month}</h3>
                    <div>
                        {entries.map((entry) => (
                            <PrototypeRow
                                key={entry.slug}
                                entry={entry}
                                isDev={isDev}
                            />
                        ))}
                    </div>
                </div>
            ))}

            <style jsx>{`
                .playground-prototype-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing--lg);
                }
                h3 {
                    font-size: var(--font-size--2xs);
                    font-weight: var(--font-weight--medium);
                    color: var(--color--neutral-400);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: var(--spacing--2xs);
                }
            `}</style>
        </div>
    );
}

export function PrototypeRow({
    entry,
    isDev,
}: {
    entry: PrototypeEntry;
    isDev: boolean;
}) {
    const router = useRouter();
    const isExternal = !!entry.externalUrl;
    const href = isExternal ? entry.externalUrl! : entry.path;
    const formattedDate = entry.date
        ? format(new Date(entry.date + "T00:00:00"), "MMM d")
        : "";

    const [dateOpen, setDateOpen] = useState(false);
    const [branchOpen, setBranchOpen] = useState(false);
    const [featured, setFeatured] = useState(entry.featured);
    const [toggling, setToggling] = useState(false);

    async function handleToggleFeatured(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (toggling) return;
        const next = !featured;
        setFeatured(next);
        setToggling(true);
        try {
            const res = await fetch("/api/toggle-featured", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug: entry.slug, featured: next }),
            });
            if (!res.ok) {
                setFeatured(!next);
            } else {
                router.refresh();
            }
        } catch {
            setFeatured(!next);
        } finally {
            setToggling(false);
        }
    }

    return (
        <div className="row">
            <a
                href={href}
                target="_blank"
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="link"
            >
                <div className="meta">
                    <div className="title-line">
                        <span className="title">{entry.title}</span>
                        {isExternal && <ExternalLink className="ext-icon" />}
                    </div>
                    {entry.description && (
                        <span className="description">{entry.description}</span>
                    )}
                </div>
                <span className="author">{entry.author}</span>
                <span className="date">{formattedDate}</span>
            </a>

            {isDev && (
                <button
                    onClick={handleToggleFeatured}
                    disabled={toggling}
                    className="star-btn"
                    data-featured={featured}
                    aria-label={featured ? "Remove from vision" : "Add to vision"}
                    aria-pressed={featured}
                >
                    <Star className="star-icon" />
                </button>
            )}

            {isDev && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            onClick={(e) => e.stopPropagation()}
                            className="menu-btn"
                            aria-label="Prototype actions"
                        >
                            <MoreHorizontal className="menu-icon" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => setDateOpen(true)}>
                            <CalendarDays style={{ width: 16, height: 16, marginRight: 8 }} />
                            Change date
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setBranchOpen(true)}>
                            <GitBranch style={{ width: 16, height: 16, marginRight: 8 }} />
                            Branch prototype
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}

            {isDev && (
                <>
                    <ChangeDateDialog
                        entry={entry}
                        open={dateOpen}
                        onOpenChange={setDateOpen}
                    />
                    <BranchDialog
                        entry={entry}
                        open={branchOpen}
                        onOpenChange={setBranchOpen}
                    />
                </>
            )}

            <style jsx>{`
                .row {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--xs);
                    padding: var(--spacing--2xs) var(--spacing--xs);
                    margin-inline: calc(var(--spacing--xs) * -1);
                    border-radius: var(--radius--xs);
                    transition: background-color var(--duration--snappy) var(--easing--ease-out);
                }
                .row:hover {
                    background-color: var(--color--neutral-50);
                }
                .link {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--xs);
                    text-align: left;
                    min-width: 0;
                    text-decoration: none;
                    color: inherit;
                }
                .meta {
                    flex: 1;
                    min-width: 0;
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing--5xs);
                }
                .title-line {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--2xs);
                }
                .title {
                    font-size: var(--font-size--sm);
                    color: var(--color--neutral-800);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    transition: color var(--duration--snappy) var(--easing--ease-out);
                }
                .row:hover .title {
                    color: var(--color--orange-500);
                }
                .title-line :global(.ext-icon) {
                    width: 14px;
                    height: 14px;
                    color: var(--color--neutral-300);
                    flex-shrink: 0;
                }
                .description {
                    font-size: var(--font-size--2xs);
                    color: var(--color--neutral-400);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .author {
                    font-size: var(--font-size--2xs);
                    color: var(--color--neutral-400);
                }
                .date {
                    font-size: var(--font-size--2xs);
                    color: var(--color--neutral-300);
                    width: 64px;
                    text-align: right;
                }
                .star-btn,
                .menu-btn {
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: var(--radius--3xs);
                    background: none;
                    border: 0;
                    cursor: pointer;
                    transition: opacity var(--duration--snappy) var(--easing--ease-out),
                        background-color var(--duration--snappy) var(--easing--ease-out),
                        color var(--duration--snappy) var(--easing--ease-out);
                }
                .star-btn:hover,
                .menu-btn:hover {
                    background-color: var(--color--neutral-125);
                }
                .star-btn {
                    opacity: 0;
                }
                .star-btn[data-featured="true"] {
                    opacity: 1;
                }
                .row:hover .star-btn,
                .star-btn:focus-visible {
                    opacity: 1;
                }
                .star-btn :global(.star-icon) {
                    width: 16px;
                    height: 16px;
                    color: var(--color--neutral-400);
                }
                .star-btn[data-featured="true"] :global(.star-icon) {
                    fill: var(--color--yellow-200);
                    color: var(--color--yellow-600);
                }
                .menu-btn {
                    color: var(--color--neutral-400);
                    opacity: 0;
                }
                .row:hover .menu-btn,
                .menu-btn[data-state="open"] {
                    opacity: 1;
                }
                .menu-btn:hover {
                    color: var(--color--neutral-800);
                }
                .menu-btn :global(.menu-icon) {
                    width: 16px;
                    height: 16px;
                }
            `}</style>
        </div>
    );
}

function ChangeDateDialog({
    entry,
    open,
    onOpenChange,
}: {
    entry: PrototypeEntry;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const initialDate = entry.date
        ? new Date(entry.date + "T00:00:00")
        : new Date();
    const [selected, setSelected] = useState<Date | undefined>(initialDate);
    const [pickerOpen, setPickerOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSave() {
        if (!selected) return;
        const iso = format(selected, "yyyy-MM-dd");
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/update-prototype-date", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug: entry.slug, date: iso }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || `Request failed (${res.status})`);
            }
            onOpenChange(false);
            window.location.reload();
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change date</DialogTitle>
                </DialogHeader>
                <div className="body">
                    <p className="prompt">
                        Pick a new date for{" "}
                        <span className="entry-name">{entry.title}</span>.
                    </p>
                    <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                            >
                                <CalendarDays style={{ width: 16, height: 16, marginRight: 8 }} />
                                {selected
                                    ? format(selected, "PPP")
                                    : "Select a date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={selected}
                                onSelect={(d) => {
                                    setSelected(d);
                                    setPickerOpen(false);
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    {error && <p className="error">{error}</p>}
                    <Button
                        onClick={handleSave}
                        disabled={!selected || loading}
                        className="w-full"
                    >
                        {loading ? "Saving..." : "Save date"}
                    </Button>
                </div>

                <style jsx>{`
                    .body {
                        display: flex;
                        flex-direction: column;
                        gap: var(--spacing--sm);
                        padding-top: var(--spacing--2xs);
                    }
                    .prompt {
                        font-size: var(--font-size--sm);
                        color: var(--color--neutral-500);
                    }
                    .entry-name {
                        color: var(--color--neutral-800);
                        font-weight: var(--font-weight--medium);
                    }
                    .error {
                        font-size: var(--font-size--2xs);
                        color: var(--color--red-500);
                    }
                `}</style>
            </DialogContent>
        </Dialog>
    );
}

function BranchDialog({
    entry,
    open,
    onOpenChange,
}: {
    entry: PrototypeEntry;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [username, setUsername] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("playground-username") || entry.author;
        }
        return entry.author;
    });
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [created, setCreated] = useState<{ path: string } | null>(null);

    async function handleBranch() {
        if (!name.trim() || !username.trim()) return;
        setLoading(true);
        setError(null);

        if (typeof window !== "undefined") {
            localStorage.setItem("playground-username", username);
        }

        try {
            const res = await fetch("/api/branch-prototype", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sourceSlug: entry.slug,
                    name: name.trim(),
                    username: username.trim(),
                }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || `Request failed (${res.status})`);
            }
            const data = await res.json();
            setCreated({ path: data.path });
            setName("");
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setLoading(false);
        }
    }

    function handleClose(nextOpen: boolean) {
        onOpenChange(nextOpen);
        if (!nextOpen && created) {
            setCreated(null);
            setError(null);
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {created ? "Branch created!" : "Branch prototype"}
                    </DialogTitle>
                </DialogHeader>
                {created ? (
                    <div className="body">
                        <div className="success-box">
                            <CheckCircle2 className="success-icon" />
                            <div>
                                <p className="success-title">
                                    Copied to <code>{created.path}</code>
                                </p>
                                <p className="success-sub">
                                    Restart the dev server to see the new route.
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                                setCreated(null);
                                onOpenChange(false);
                            }}
                        >
                            Done
                        </Button>

                        <style jsx>{`
                            .body {
                                display: flex;
                                flex-direction: column;
                                gap: var(--spacing--sm);
                                padding-top: var(--spacing--2xs);
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
                        `}</style>
                    </div>
                ) : (
                    <div className="body">
                        <p className="prompt">
                            Start a new prototype by copying the content of{" "}
                            <span className="entry-name">{entry.title}</span>.
                        </p>
                        <div className="field">
                            <Label htmlFor="branch-username">Username</Label>
                            <Input
                                id="branch-username"
                                placeholder="your-username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="field">
                            <Label htmlFor="branch-name">
                                New prototype name
                            </Label>
                            <Input
                                id="branch-name"
                                placeholder="my-cool-prototype"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        {error && <p className="error">{error}</p>}
                        <Button
                            onClick={handleBranch}
                            disabled={
                                !name.trim() ||
                                !username.trim() ||
                                loading
                            }
                            className="w-full"
                        >
                            {loading ? "Branching..." : "Create branch"}
                        </Button>

                        <style jsx>{`
                            .body {
                                display: flex;
                                flex-direction: column;
                                gap: var(--spacing--sm);
                                padding-top: var(--spacing--2xs);
                            }
                            .prompt {
                                font-size: var(--font-size--sm);
                                color: var(--color--neutral-500);
                            }
                            .entry-name {
                                color: var(--color--neutral-800);
                                font-weight: var(--font-weight--medium);
                            }
                            .field {
                                display: flex;
                                flex-direction: column;
                                gap: var(--spacing--2xs);
                            }
                            .error {
                                font-size: var(--font-size--2xs);
                                color: var(--color--red-500);
                            }
                        `}</style>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
