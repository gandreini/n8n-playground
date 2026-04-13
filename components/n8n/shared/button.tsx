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

const sizeClasses: Record<ButtonSize, string> = {
    xsmall: "[--button--height:var(--height--xs)] px-[var(--spacing--2xs)] [--button--radius:var(--radius--3xs)] [--button--font-size:var(--font-size--2xs)]",
    small: "[--button--height:var(--height--sm)] px-[var(--spacing--xs)] [--button--radius:var(--radius--3xs)] [--button--font-size:var(--font-size--xs)]",
    medium: "[--button--height:var(--height--md)] px-[var(--spacing--xs)] [--button--radius:var(--radius--3xs)] [--button--font-size:var(--font-size--sm)]",
    large: "[--button--height:var(--height--lg)] px-[var(--spacing--sm)] [--button--radius:var(--radius--2xs)] [--button--font-size:var(--font-size--sm)]",
    xlarge: "[--button--height:var(--height--xl)] px-[var(--spacing--sm)] [--button--radius:var(--radius--xs)] [--button--font-size:var(--font-size--md)]",
};

const variantClasses: Record<ButtonVariant, string> = {
    solid: [
        "bg-[var(--color--orange-400)] text-[color:var(--color--neutral-white)]",
        "shadow-[inset_0_0_0_1px_var(--color--orange-400),0_1px_3px_0_var(--color--black-alpha-100)]",
        "hover:bg-[var(--color--orange-500)] hover:shadow-[inset_0_0_0_1px_var(--color--orange-500),0_1px_3px_0_var(--color--black-alpha-100)]",
        "active:bg-[var(--color--orange-600)] active:shadow-[inset_0_0_0_1px_var(--color--orange-600),0_1px_3px_0_var(--color--black-alpha-100)]",
    ].join(" "),
    subtle: [
        "bg-[var(--color--neutral-white)] text-[color:var(--color--neutral-900)]",
        "shadow-[inset_0_0_0_1px_var(--color--black-alpha-200),0_1px_3px_var(--color--black-alpha-100)]",
        "hover:bg-[var(--color--neutral-150)] hover:shadow-[inset_0_0_0_1px_var(--color--black-alpha-200),0_1px_3px_0_var(--color--black-alpha-200)]",
        "active:bg-[var(--color--neutral-200)] active:shadow-[inset_0_0_0_1px_var(--color--black-alpha-300),0_1px_3px_0_var(--color--black-alpha-200)]",
    ].join(" "),
    outline: [
        "bg-transparent text-[color:var(--color--neutral-900)]",
        "shadow-[inset_0_0_0_1px_var(--color--black-alpha-200)]",
        "hover:bg-[var(--color--neutral-150)] hover:shadow-[inset_0_0_0_1px_var(--color--black-alpha-200)]",
        "active:bg-[var(--color--black-alpha-200)] active:shadow-[inset_0_0_0_1px_var(--color--black-alpha-300)]",
    ].join(" "),
    ghost: [
        "bg-transparent text-[color:var(--color--neutral-900)]",
        "hover:bg-[var(--color--black-alpha-100)]",
        "active:bg-[var(--color--black-alpha-200)]",
    ].join(" "),
    destructive: [
        "bg-[var(--color--red-500)] text-[color:var(--color--neutral-white)]",
        "shadow-[inset_0_0_0_1px_var(--color--red-500),0_1px_3px_0_var(--color--black-alpha-100)]",
        "hover:bg-[var(--color--red-600)] hover:shadow-[inset_0_0_0_1px_var(--color--red-600),0_1px_3px_0_var(--color--black-alpha-100)]",
        "active:bg-[var(--color--red-600)]",
    ].join(" "),
    success: [
        "bg-[var(--color--green-600)] text-[color:var(--color--neutral-white)]",
        "shadow-[inset_0_0_0_1px_var(--color--green-600),0_1px_3px_0_var(--color--black-alpha-100)]",
        "hover:bg-[var(--color--green-700)] hover:shadow-[inset_0_0_0_1px_var(--color--green-700),0_1px_3px_0_var(--color--black-alpha-100)]",
        "active:bg-[var(--color--green-700)]",
    ].join(" "),
};

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
            className={cn(
                "n8n-button",
                "appearance-none select-none cursor-pointer no-underline border-none",
                "grid items-center font-[var(--font-weight--medium)] leading-none whitespace-nowrap",
                "h-[var(--button--height)] rounded-[var(--button--radius)] text-[length:var(--button--font-size)]",
                "transition-snappy",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color--orange-300)] focus-visible:ring-offset-1",
                sizeClasses[size],
                variantClasses[variant],
                iconOnly && "w-[var(--button--height)] !px-0 justify-center",
                (disabled || loading) && "opacity-50 cursor-not-allowed",
                className,
            )}
        >
            <div className="flex items-center justify-center gap-[var(--spacing--3xs)]">
                {icon && !loading && icon}
                {!iconOnly && children && <span>{children}</span>}
            </div>
        </button>
    );
}
