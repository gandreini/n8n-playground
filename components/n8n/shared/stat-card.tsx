"use client";

import { cn } from "@/lib/utils";

interface StatCardProps {
    label: string;
    value: string;
    trend?: string;
    trendDown?: boolean;
    className?: string;
}

export function StatCard({ label, value, trend, trendDown, className }: StatCardProps) {
    return (
        <div
            className={cn(
                "n8n-stat-card flex-1 min-w-0 p-4 bg-[var(--color--neutral-white)] border border-[var(--color--neutral-150)] rounded-[var(--radius--xs)]",
                className,
            )}
        >
            <p className="text-[length:var(--font-size--xs)] text-[color:var(--color--neutral-500)] mb-1 whitespace-nowrap">
                {label}
            </p>
            <div className="flex items-baseline gap-2">
                <span className="text-[length:var(--font-size--2xl)] font-[var(--font-weight--bold)] text-[color:var(--color--neutral-800)] whitespace-nowrap">
                    {value}
                </span>
                {trend && (
                    <span
                        className={cn(
                            "text-[length:var(--font-size--2xs)] whitespace-nowrap",
                            trendDown
                                ? "text-[color:var(--color--red-500)]"
                                : "text-[color:var(--color--neutral-400)]",
                        )}
                    >
                        {trendDown ? "▽" : "△"}
                        {trend}
                    </span>
                )}
            </div>
        </div>
    );
}
