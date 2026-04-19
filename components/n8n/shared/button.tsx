"use client";

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

type ButtonVariant = "solid" | "subtle" | "outline" | "ghost" | "destructive" | "success";
type ButtonSize = "xsmall" | "small" | "medium" | "large" | "xlarge";

interface N8nButtonProps {
    children?: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: ReactNode;
    iconOnly?: boolean;
    disabled?: boolean;
    loading?: boolean;
    className?: string;
    onClick?: (e: React.MouseEvent) => void;
}

export function N8nButton({
    children,
    variant = "solid",
    size = "medium",
    icon,
    iconOnly = false,
    disabled = false,
    loading = false,
    className,
    onClick,
}: N8nButtonProps) {
    return (
        <button
            type="button"
            disabled={disabled || loading}
            aria-disabled={disabled || loading || undefined}
            aria-busy={loading || undefined}
            onClick={onClick}
            data-variant={variant}
            data-size={size}
            data-icon-only={iconOnly ? "true" : undefined}
            data-disabled={disabled || loading ? "true" : undefined}
            className={cn("n8n-button", className)}
        >
            <span className="inner">
                {icon && !loading && icon}
                {!iconOnly && children && <span>{children}</span>}
            </span>

            <style jsx>{`
                .n8n-button {
                    appearance: none;
                    user-select: none;
                    cursor: pointer;
                    text-decoration: none;
                    border: 0;
                    display: grid;
                    align-items: center;
                    font-weight: var(--font-weight--medium);
                    line-height: 1;
                    white-space: nowrap;
                    transition: background-color var(--duration--snappy) var(--easing--ease-out),
                        box-shadow var(--duration--snappy) var(--easing--ease-out),
                        color var(--duration--snappy) var(--easing--ease-out);
                }
                .n8n-button:focus {
                    outline: none;
                }
                .n8n-button:focus-visible {
                    box-shadow: 0 0 0 1px var(--color--neutral-white),
                        0 0 0 3px var(--color--orange-300);
                }

                /* Sizes */
                .n8n-button[data-size="xsmall"] {
                    height: var(--height--xs);
                    padding-inline: var(--spacing--2xs);
                    border-radius: var(--radius--3xs);
                    font-size: var(--font-size--2xs);
                }
                .n8n-button[data-size="small"] {
                    height: var(--height--sm);
                    padding-inline: var(--spacing--xs);
                    border-radius: var(--radius--3xs);
                    font-size: var(--font-size--xs);
                }
                .n8n-button[data-size="medium"] {
                    height: var(--height--md);
                    padding-inline: var(--spacing--xs);
                    border-radius: var(--radius--3xs);
                    font-size: var(--font-size--sm);
                }
                .n8n-button[data-size="large"] {
                    height: var(--height--lg);
                    padding-inline: var(--spacing--sm);
                    border-radius: var(--radius--2xs);
                    font-size: var(--font-size--sm);
                }
                .n8n-button[data-size="xlarge"] {
                    height: var(--height--xl);
                    padding-inline: var(--spacing--sm);
                    border-radius: var(--radius--xs);
                    font-size: var(--font-size--md);
                }

                /* Icon-only tweaks: force square + centered */
                .n8n-button[data-icon-only="true"] {
                    padding-inline: 0 !important;
                    justify-content: center;
                }
                .n8n-button[data-icon-only="true"][data-size="xsmall"] { width: var(--height--xs); }
                .n8n-button[data-icon-only="true"][data-size="small"]  { width: var(--height--sm); }
                .n8n-button[data-icon-only="true"][data-size="medium"] { width: var(--height--md); }
                .n8n-button[data-icon-only="true"][data-size="large"]  { width: var(--height--lg); }
                .n8n-button[data-icon-only="true"][data-size="xlarge"] { width: var(--height--xl); }

                /* Variants */
                .n8n-button[data-variant="solid"] {
                    background-color: var(--color--orange-400);
                    color: var(--color--neutral-white);
                    box-shadow: inset 0 0 0 1px var(--color--orange-400),
                        0 1px 3px 0 var(--color--black-alpha-100);
                }
                .n8n-button[data-variant="solid"]:hover {
                    background-color: var(--color--orange-500);
                    box-shadow: inset 0 0 0 1px var(--color--orange-500),
                        0 1px 3px 0 var(--color--black-alpha-100);
                }
                .n8n-button[data-variant="solid"]:active {
                    background-color: var(--color--orange-600);
                    box-shadow: inset 0 0 0 1px var(--color--orange-600),
                        0 1px 3px 0 var(--color--black-alpha-100);
                }

                .n8n-button[data-variant="subtle"] {
                    background-color: var(--color--neutral-white);
                    color: var(--color--neutral-900);
                    box-shadow: inset 0 0 0 1px var(--color--black-alpha-200),
                        0 1px 3px var(--color--black-alpha-100);
                }
                .n8n-button[data-variant="subtle"]:hover {
                    background-color: var(--color--neutral-150);
                    box-shadow: inset 0 0 0 1px var(--color--black-alpha-200),
                        0 1px 3px 0 var(--color--black-alpha-200);
                }
                .n8n-button[data-variant="subtle"]:active {
                    background-color: var(--color--neutral-200);
                    box-shadow: inset 0 0 0 1px var(--color--black-alpha-300),
                        0 1px 3px 0 var(--color--black-alpha-200);
                }

                .n8n-button[data-variant="outline"] {
                    background-color: transparent;
                    color: var(--color--neutral-900);
                    box-shadow: inset 0 0 0 1px var(--color--black-alpha-200);
                }
                .n8n-button[data-variant="outline"]:hover {
                    background-color: var(--color--neutral-150);
                    box-shadow: inset 0 0 0 1px var(--color--black-alpha-200);
                }
                .n8n-button[data-variant="outline"]:active {
                    background-color: var(--color--black-alpha-200);
                    box-shadow: inset 0 0 0 1px var(--color--black-alpha-300);
                }

                .n8n-button[data-variant="ghost"] {
                    background-color: transparent;
                    color: var(--color--neutral-900);
                }
                .n8n-button[data-variant="ghost"]:hover {
                    background-color: var(--color--black-alpha-100);
                }
                .n8n-button[data-variant="ghost"]:active {
                    background-color: var(--color--black-alpha-200);
                }

                .n8n-button[data-variant="destructive"] {
                    background-color: var(--color--red-500);
                    color: var(--color--neutral-white);
                    box-shadow: inset 0 0 0 1px var(--color--red-500),
                        0 1px 3px 0 var(--color--black-alpha-100);
                }
                .n8n-button[data-variant="destructive"]:hover {
                    background-color: var(--color--red-600);
                    box-shadow: inset 0 0 0 1px var(--color--red-600),
                        0 1px 3px 0 var(--color--black-alpha-100);
                }
                .n8n-button[data-variant="destructive"]:active {
                    background-color: var(--color--red-600);
                }

                .n8n-button[data-variant="success"] {
                    background-color: var(--color--green-600);
                    color: var(--color--neutral-white);
                    box-shadow: inset 0 0 0 1px var(--color--green-600),
                        0 1px 3px 0 var(--color--black-alpha-100);
                }
                .n8n-button[data-variant="success"]:hover {
                    background-color: var(--color--green-700);
                    box-shadow: inset 0 0 0 1px var(--color--green-700),
                        0 1px 3px 0 var(--color--black-alpha-100);
                }
                .n8n-button[data-variant="success"]:active {
                    background-color: var(--color--green-700);
                }

                /* Disabled */
                .n8n-button[data-disabled="true"] {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .inner {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: var(--spacing--3xs);
                }
            `}</style>
        </button>
    );
}
