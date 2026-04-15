"use client";

import type { PrototypeEntry } from "@/lib/prototypes";
import { PrototypeRow } from "./prototype-list";

interface VisionListProps {
    prototypes: PrototypeEntry[];
    searchQuery: string;
    isDev?: boolean;
}

export function VisionList({
    prototypes,
    searchQuery,
    isDev = false,
}: VisionListProps) {
    const featured = prototypes.filter((p) => p.featured && !p.template);

    const filtered = searchQuery.trim()
        ? featured.filter(
              (e) =>
                  e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  e.author.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : featured;

    if (filtered.length === 0) {
        return (
            <p className="text-[var(--color--neutral-400)] text-sm py-8">
                No vision prototypes yet. Click the star next to a prototype to
                add it here.
            </p>
        );
    }

    return (
        <div className="playground-vision-list space-y-0">
            {filtered.map((entry) => (
                <PrototypeRow key={entry.slug} entry={entry} isDev={isDev} />
            ))}
        </div>
    );
}
