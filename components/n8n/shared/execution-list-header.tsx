"use client";

export function ExecutionListHeader() {
    return (
        <div className="n8n-execution-list-header">
            <span className="cell-check" />
            <span className="cell-workflow">Workflow</span>
            <span className="cell-status">Status</span>
            <span className="cell-started">Started</span>
            <span className="cell-runtime">Run Time</span>
            <span className="cell-id">Exec. ID</span>
            <span className="cell-action" />
            <span className="cell-menu" />

            <style jsx>{`
                .n8n-execution-list-header {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--sm);
                    padding: var(--spacing--2xs) var(--spacing--sm);
                    background-color: var(--color--neutral-50);
                    border-bottom: 1px solid var(--color--neutral-100);
                    font-size: var(--font-size--2xs);
                    color: var(--color--neutral-500);
                    font-weight: var(--font-weight--medium);
                }
                .cell-check {
                    width: 16px;
                }
                .cell-workflow {
                    flex: 1;
                }
                .cell-status {
                    width: 96px;
                }
                .cell-started {
                    width: 144px;
                }
                .cell-runtime {
                    width: 96px;
                }
                .cell-id {
                    width: 80px;
                }
                .cell-action {
                    width: 56px;
                }
                .cell-menu {
                    width: 32px;
                }
            `}</style>
        </div>
    );
}
