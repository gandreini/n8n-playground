"use client";

export function ExecutionListHeader() {
    return (
        <div className="n8n-execution-list-header flex items-center gap-4 px-4 py-2 bg-[var(--color--neutral-50)] border-b border-[var(--color--neutral-100)] text-[length:var(--font-size--2xs)] text-[color:var(--color--neutral-500)] font-[var(--font-weight--medium)]">
            <span className="w-4" />
            <span className="flex-1">Workflow</span>
            <span className="w-24">Status</span>
            <span className="w-36">Started</span>
            <span className="w-24">Run Time</span>
            <span className="w-20">Exec. ID</span>
            <span className="w-14" />
            <span className="w-8" />
        </div>
    );
}
