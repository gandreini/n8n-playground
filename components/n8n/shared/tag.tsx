import { cn } from "@/lib/utils";

interface TagProps {
    text: string;
    className?: string;
}

export function Tag({ text, className }: TagProps) {
    return (
        <span
            className={cn(
                "n8n-tag inline-flex items-center px-1 py-0.5 rounded-[var(--radius--3xs)] bg-[var(--color--neutral-125)] text-[length:var(--font-size--2xs)] text-[color:var(--color--text--tint-1)] leading-[14px]",
                className,
            )}
        >
            {text}
        </span>
    );
}
