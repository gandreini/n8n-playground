"use client";

import { User } from "lucide-react";
import { formatDistanceToNowStrict, format } from "date-fns";
import type { Credential } from "@/lib/store";
import { ServiceIcon } from "./service-icon";
import { IconButton } from "./icon-button";
import { MoreVertical } from "lucide-react";

interface CredentialRowProps {
    credential: Credential;
    onClick?: () => void;
}

export function CredentialRow({ credential, onClick }: CredentialRowProps) {
    return (
        <div
            onClick={onClick}
            className="n8n-credential-row flex items-center gap-4 px-4 py-3 border-b border-[var(--color--neutral-100)] hover:bg-[var(--color--neutral-50)] cursor-pointer transition-snappy"
        >
            <ServiceIcon service={credential.icon} size={36} />
            <div className="flex-1">
                <span className="text-[length:var(--font-size--sm)] font-[var(--font-weight--bold)] text-[color:var(--color--neutral-800)]">
                    {credential.name}
                </span>
                <p className="text-[length:var(--font-size--2xs)] text-[color:var(--color--neutral-400)] mt-0.5">
                    {credential.type} | Last updated{" "}
                    {formatDistanceToNowStrict(credential.lastUpdated)} ago |
                    Created {format(credential.createdAt, "d MMMM, yyyy")}
                </p>
            </div>
            <div className="flex items-center gap-3">
                <span className="px-2 py-1 text-[length:var(--font-size--2xs)] border border-[var(--color--neutral-200)] rounded-[var(--radius--3xs)] flex items-center gap-1 text-[color:var(--color--neutral-500)]">
                    <User className="w-3 h-3" />
                    Personal
                </span>
                <IconButton
                    icon={<MoreVertical className="w-4 h-4 text-[var(--color--neutral-400)]" />}
                    label="More options"
                />
            </div>
        </div>
    );
}
