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
        <div className={cn("n8n-tab-bar", className)}>
            <div className="inner">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        data-active={activeTab === tab.id}
                        className="tab"
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <style jsx>{`
                .n8n-tab-bar {
                    padding-inline: var(--spacing--md);
                }
                .inner {
                    display: flex;
                }
                .tab {
                    padding: var(--spacing--2xs) var(--spacing--xs);
                    font-size: var(--font-size--sm);
                    font-weight: var(--font-weight--medium);
                    border: 0;
                    border-bottom: 2px solid transparent;
                    background: transparent;
                    color: var(--color--neutral-500);
                    cursor: pointer;
                    transition: color var(--duration--snappy) var(--easing--ease-out),
                        border-color var(--duration--snappy) var(--easing--ease-out);
                }
                .tab:hover {
                    color: var(--color--neutral-700);
                }
                .tab[data-active="true"] {
                    color: var(--color--orange-300);
                    border-bottom-color: var(--color--orange-300);
                }
            `}</style>
        </div>
    );
}
