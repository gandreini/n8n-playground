import { cn } from "@/lib/utils";

interface TagProps {
    text: string;
    className?: string;
}

export function Tag({ text, className }: TagProps) {
    return (
        <span className={cn("n8n-tag", className)}>
            {text}

            <style jsx>{`
                .n8n-tag {
                    display: inline-flex;
                    align-items: center;
                    padding: 2px 4px;
                    border-radius: var(--radius--3xs);
                    background-color: var(--color--neutral-125);
                    font-size: var(--font-size--2xs);
                    color: var(--color--text--tint-1);
                    line-height: 14px;
                }
            `}</style>
        </span>
    );
}
