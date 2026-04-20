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
        <div className={cn("n8n-stat-card", className)}>
            <p className="label">{label}</p>
            <div className="value-row">
                <span className="value">{value}</span>
                {trend && (
                    <span className="trend" data-down={trendDown ? "true" : undefined}>
                        {trendDown ? "▽" : "△"}
                        {trend}
                    </span>
                )}
            </div>

            <style jsx>{`
                .n8n-stat-card {
                    flex: 1;
                    min-width: 0;
                    padding: var(--spacing--sm);
                    background-color: var(--color--neutral-white);
                    border-right: 1px solid var(--color--neutral-150);
                }
                .n8n-stat-card:last-child {
                    border-right: 0;
                }
                .label {
                    font-size: var(--font-size--xs);
                    color: var(--color--neutral-500);
                    margin-bottom: var(--spacing--4xs);
                    white-space: nowrap;
                }
                .value-row {
                    display: flex;
                    align-items: baseline;
                    gap: var(--spacing--2xs);
                }
                .value {
                    font-size: var(--font-size--2xl);
                    font-weight: var(--font-weight--bold);
                    color: var(--color--neutral-800);
                    white-space: nowrap;
                }
                .trend {
                    font-size: var(--font-size--2xs);
                    color: var(--color--neutral-400);
                    white-space: nowrap;
                }
                .trend[data-down="true"] {
                    color: var(--color--red-500);
                }
            `}</style>
        </div>
    );
}
