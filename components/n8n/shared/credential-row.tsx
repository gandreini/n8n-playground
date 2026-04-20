"use client";

import { User, MoreVertical } from "lucide-react";
import { formatDistanceToNowStrict, format } from "date-fns";
import type { Credential } from "@/lib/store";
import { ServiceIcon } from "./service-icon";
import { IconButton } from "./icon-button";

interface CredentialRowProps {
    credential: Credential;
    onClick?: () => void;
}

export function CredentialRow({ credential, onClick }: CredentialRowProps) {
    return (
        <div onClick={onClick} className="n8n-credential-row">
            <ServiceIcon service={credential.icon} size={36} />
            <div className="body">
                <span className="name">{credential.name}</span>
                <p className="meta">
                    {credential.type} | Last updated{" "}
                    {formatDistanceToNowStrict(credential.lastUpdated)} ago | Created{" "}
                    {format(credential.createdAt, "d MMMM, yyyy")}
                </p>
            </div>
            <div className="right">
                <span className="pill">
                    <User className="pill-icon" />
                    Personal
                </span>
                <IconButton
                    icon={
                        <MoreVertical
                            style={{ width: 16, height: 16, color: "var(--color--neutral-400)" }}
                        />
                    }
                    label="More options"
                />
            </div>

            <style jsx>{`
                .n8n-credential-row {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--sm);
                    padding: var(--spacing--xs) var(--spacing--sm);
                    border-bottom: 1px solid var(--color--neutral-100);
                    cursor: pointer;
                    transition: background-color var(--duration--snappy) var(--easing--ease-out);
                }
                .n8n-credential-row:hover {
                    background-color: var(--color--neutral-50);
                }
                .body {
                    flex: 1;
                }
                .name {
                    font-size: var(--font-size--sm);
                    font-weight: var(--font-weight--bold);
                    color: var(--color--neutral-800);
                }
                .meta {
                    font-size: var(--font-size--2xs);
                    color: var(--color--neutral-400);
                    margin-top: 2px;
                }
                .right {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--xs);
                }
                .pill {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--4xs);
                    padding: var(--spacing--4xs) var(--spacing--2xs);
                    font-size: var(--font-size--2xs);
                    border: 1px solid var(--color--neutral-200);
                    border-radius: var(--radius--3xs);
                    color: var(--color--neutral-500);
                }
                .pill :global(.pill-icon) {
                    width: 12px;
                    height: 12px;
                }
            `}</style>
        </div>
    );
}
