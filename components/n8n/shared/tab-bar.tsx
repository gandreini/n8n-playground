"use client";

import { cn } from "@/lib/utils";

interface Tab {
    id: string;
    label: string;
}

interface TabBarProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
    className?: string;
}

export function TabBar({ tabs, activeTab, onTabChange, className }: TabBarProps) {
    return (
        <div className={cn("n8n-tab-bar px-6", className)}>
            <div className="flex">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={cn(
                            "n8n-tab-bar__tab px-4 py-2 text-[length:var(--font-size--sm)] font-[var(--font-weight--medium)] border-b-2 transition-snappy",
                            activeTab === tab.id
                                ? "text-[color:var(--color--orange-300)] border-[var(--color--orange-300)]"
                                : "text-[color:var(--color--neutral-500)] border-transparent hover:text-[color:var(--color--neutral-700)]",
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
