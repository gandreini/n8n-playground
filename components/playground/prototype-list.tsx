"use client";

import { useState } from "react";
import Link from "next/link";
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
import { cn } from "@/lib/utils";
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
            <p className="text-[var(--color--neutral-400)] text-sm py-8">
                No prototypes found.
            </p>
        );
    }

    return (
        <div className="playground-prototype-list space-y-6">
            {Object.entries(groups).map(([month, entries]) => (
                <div key={month}>
                    <h3 className="text-[length:var(--font-size--2xs)] font-[number:var(--font-weight--medium)] text-[var(--color--neutral-400)] uppercase tracking-wide mb-2">
                        {month}
                    </h3>
                    <div className="space-y-0">
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

    const rowBody = (
        <>
            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-[var(--color--neutral-800)] group-hover:text-[var(--color--orange-500)] transition-colors truncate">
                        {entry.title}
                    </span>
                    {isExternal && (
                        <ExternalLink className="w-3.5 h-3.5 text-[var(--color--neutral-300)] shrink-0" />
                    )}
                </div>
                {entry.description && (
                    <span className="text-[length:var(--font-size--2xs)] text-[var(--color--neutral-400)] truncate">
                        {entry.description}
                    </span>
                )}
            </div>
            <span className="text-[length:var(--font-size--2xs)] text-[var(--color--neutral-400)]">
                {entry.author}
            </span>
            <span className="text-[length:var(--font-size--2xs)] text-[var(--color--neutral-300)] w-16 text-right">
                {formattedDate}
            </span>
        </>
    );

    const linkClasses =
        "flex-1 flex items-center gap-3 text-left min-w-0";

    return (
        <div className="group flex items-center gap-3 px-3 py-2 -mx-3 rounded-[var(--radius--xs)] hover:bg-[var(--color--neutral-50)] transition-colors">
            {isExternal ? (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClasses}
                >
                    {rowBody}
                </a>
            ) : (
                <Link href={href} target="_blank" className={linkClasses}>
                    {rowBody}
                </Link>
            )}

            {isDev && (
                <button
                    onClick={handleToggleFeatured}
                    disabled={toggling}
                    className={cn(
                        "w-6 h-6 flex items-center justify-center rounded-[var(--radius--3xs)] transition-opacity",
                        "hover:bg-[var(--color--neutral-125)]",
                        featured
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
                    )}
                    aria-label={featured ? "Remove from vision" : "Add to vision"}
                    aria-pressed={featured}
                >
                    <Star
                        className={cn(
                            "w-4 h-4",
                            featured
                                ? "fill-[var(--color--yellow-200)] text-[var(--color--yellow-600)]"
                                : "text-[var(--color--neutral-400)]",
                        )}
                    />
                </button>
            )}

            {isDev && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            onClick={(e) => e.stopPropagation()}
                            className={cn(
                                "w-6 h-6 flex items-center justify-center rounded-[var(--radius--3xs)]",
                                "text-[var(--color--neutral-400)] hover:bg-[var(--color--neutral-125)] hover:text-[var(--color--neutral-800)]",
                                "opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 transition-opacity",
                            )}
                            aria-label="Prototype actions"
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => setDateOpen(true)}>
                            <CalendarDays className="w-4 h-4 mr-2" />
                            Change date
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setBranchOpen(true)}>
                            <GitBranch className="w-4 h-4 mr-2" />
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
                <div className="space-y-4 pt-2">
                    <p className="text-sm text-[var(--color--neutral-500)]">
                        Pick a new date for{" "}
                        <span className="text-[var(--color--neutral-800)] font-medium">
                            {entry.title}
                        </span>
                        .
                    </p>
                    <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                            >
                                <CalendarDays className="w-4 h-4 mr-2" />
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
                    {error && (
                        <p className="text-xs text-[var(--color--red-500)]">
                            {error}
                        </p>
                    )}
                    <Button
                        onClick={handleSave}
                        disabled={!selected || loading}
                        className="w-full"
                    >
                        {loading ? "Saving..." : "Save date"}
                    </Button>
                </div>
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
                    <div className="space-y-4 pt-2">
                        <div className="flex items-start gap-3 p-4 rounded-[var(--radius--xs)] bg-[var(--color--green-50)] border border-[var(--color--green-200)]">
                            <CheckCircle2 className="w-5 h-5 text-[var(--color--green-600)] shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-[var(--color--neutral-800)]">
                                    Copied to{" "}
                                    <code className="text-xs bg-[var(--color--neutral-125)] px-1 py-0.5 rounded">
                                        {created.path}
                                    </code>
                                </p>
                                <p className="text-xs text-[var(--color--neutral-500)]">
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
                    </div>
                ) : (
                    <div className="space-y-4 pt-2">
                        <p className="text-sm text-[var(--color--neutral-500)]">
                            Start a new prototype by copying the content of{" "}
                            <span className="text-[var(--color--neutral-800)] font-medium">
                                {entry.title}
                            </span>
                            .
                        </p>
                        <div className="space-y-2">
                            <Label htmlFor="branch-username">Username</Label>
                            <Input
                                id="branch-username"
                                placeholder="your-username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
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
                        {error && (
                            <p className="text-xs text-[var(--color--red-500)]">
                                {error}
                            </p>
                        )}
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
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
