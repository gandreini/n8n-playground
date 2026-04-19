"use client";

import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "./icon-button";

interface PaginationProps {
    total: number;
    currentPage?: number;
    pageSize?: number;
    className?: string;
}

export function Pagination({ total, currentPage = 1, pageSize = 100, className }: PaginationProps) {
    return (
        <div className={cn("n8n-pagination", className)}>
            <span>Total {total}</span>
            <div className="pages">
                <IconButton
                    icon={<ChevronLeft style={{ width: 16, height: 16 }} />}
                    size="sm"
                    label="Previous page"
                />
                {[1, 2, 3, 4].map((page) => (
                    <button
                        key={page}
                        data-active={page === currentPage ? "true" : undefined}
                        className="page-btn"
                    >
                        {page}
                    </button>
                ))}
                <IconButton
                    icon={<ChevronRight style={{ width: 16, height: 16 }} />}
                    size="sm"
                    label="Next page"
                />
            </div>
            <div className="page-size">
                <span>{pageSize}/page</span>
                <ChevronDown style={{ width: 16, height: 16 }} />
            </div>

            <style jsx>{`
                .n8n-pagination {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    gap: var(--spacing--sm);
                    padding: var(--spacing--xs) var(--spacing--sm);
                    font-size: var(--font-size--sm);
                    color: var(--color--neutral-500);
                }
                .pages {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--4xs);
                }
                .page-btn {
                    width: 28px;
                    height: 28px;
                    border-radius: var(--radius--3xs);
                    font-size: var(--font-size--sm);
                    background: transparent;
                    border: 1px solid transparent;
                    color: inherit;
                    cursor: pointer;
                    transition: background-color var(--duration--snappy) var(--easing--ease-out);
                }
                .page-btn:hover {
                    background-color: var(--color--neutral-100);
                }
                .page-btn[data-active="true"] {
                    border-color: var(--color--orange-300);
                    color: var(--color--orange-300);
                }
                .page-btn[data-active="true"]:hover {
                    background-color: transparent;
                }
                .page-size {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--4xs);
                }
            `}</style>
        </div>
    );
}
