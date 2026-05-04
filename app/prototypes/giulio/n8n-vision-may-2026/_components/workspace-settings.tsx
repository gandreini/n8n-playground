"use client";

import { useState } from "react";
import { ArrowLeft, ChevronRight, Search } from "lucide-react";

interface WorkspaceSettingsProps {
    workspaceId: string;
    workspaceName: string;
    workspaceAvatar: string;
    workspaceBg: string;
    onClose: () => void;
}

interface SecretVault {
    id: string;
    name: string;
    secretCount: number;
}

const FAKE_VAULTS: SecretVault[] = [
    { id: "sdf", name: "SDF", secretCount: 0 },
];

export function WorkspaceSettings({
    workspaceName,
    workspaceAvatar,
    workspaceBg,
    onClose,
}: WorkspaceSettingsProps) {
    const [name, setName] = useState(workspaceName);
    const [description, setDescription] = useState("");
    const [vaultSearch, setVaultSearch] = useState("");

    const filteredVaults = FAKE_VAULTS.filter((v) =>
        v.name.toLowerCase().includes(vaultSearch.toLowerCase())
    );

    return (
        <div className="ws-settings">
            <div className="top-bar">
                <button className="back-btn" onClick={onClose}>
                    <ArrowLeft />
                    <span>Back</span>
                </button>
                <div className="title-row">
                    <span className="title-avatar" style={{ backgroundColor: workspaceBg }}>
                        {workspaceAvatar}
                    </span>
                    <h1 className="title">{name || "Workspace"} settings</h1>
                </div>
            </div>

            <div className="content n8n-scrollbar">
                <div className="content-inner">
                    {/* Icon and name */}
                    <section className="section">
                        <label className="field-label" htmlFor="ws-name">
                            Icon and name
                        </label>
                        <div className="icon-name-row">
                            <button className="icon-btn" type="button" aria-label="Change icon">
                                <span
                                    className="icon-preview"
                                    style={{ backgroundColor: workspaceBg }}
                                >
                                    {workspaceAvatar}
                                </span>
                            </button>
                            <input
                                id="ws-name"
                                className="text-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Workspace name"
                            />
                        </div>
                    </section>

                    {/* Description */}
                    <section className="section">
                        <label className="field-label" htmlFor="ws-description">
                            Description
                        </label>
                        <textarea
                            id="ws-description"
                            className="textarea-input"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder=""
                            rows={3}
                        />
                    </section>

                    {/* External secret vaults */}
                    <section className="section">
                        <h2 className="section-title">External secret vaults</h2>
                        <div className="vaults-toolbar">
                            <div className="search-input-wrap">
                                <Search />
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search secrets…"
                                    value={vaultSearch}
                                    onChange={(e) => setVaultSearch(e.target.value)}
                                />
                            </div>
                            <button className="secondary-btn" type="button">
                                Add secrets vault
                            </button>
                        </div>

                        <div className="vault-table">
                            <div className="vault-table-head">Secret name</div>
                            {filteredVaults.length === 0 ? (
                                <div className="vault-empty">No vaults found</div>
                            ) : (
                                filteredVaults.map((vault) => (
                                    <button
                                        key={vault.id}
                                        type="button"
                                        className="vault-row"
                                    >
                                        <ChevronRight className="vault-chevron" />
                                        <span className="vault-name">{vault.name}</span>
                                        <span className="vault-count">
                                            {vault.secretCount}{" "}
                                            {vault.secretCount === 1 ? "secret" : "secrets"}
                                        </span>
                                    </button>
                                ))
                            )}
                        </div>
                    </section>

                    {/* Danger zone */}
                    <section className="section danger-zone">
                        <h2 className="section-title">Danger zone</h2>
                        <p className="danger-copy">
                            When deleting a workspace, you can also choose to move all
                            workflows and credentials to another workspace.
                        </p>
                        <button className="secondary-btn" type="button">
                            Delete this workspace
                        </button>
                    </section>
                </div>
            </div>

            <style jsx>{`
                .ws-settings {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    background-color: var(--color--background-base);
                }

                .top-bar {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--md);
                    height: 56px;
                    padding: 0 var(--spacing--md);
                    border-bottom: 1px solid
                        var(--border-color--light, var(--color--neutral-150));
                    flex-shrink: 0;
                }
                .back-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                    padding: var(--spacing--3xs) var(--spacing--2xs);
                    border: 0;
                    background: transparent;
                    border-radius: var(--radius--3xs);
                    color: var(--color--neutral-500);
                    cursor: pointer;
                    font-size: var(--font-size--xs);
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .back-btn:hover {
                    background-color: var(--color--neutral-100);
                    color: var(--color--neutral-700);
                }
                .back-btn :global(svg) {
                    width: 14px;
                    height: 14px;
                }
                .title-row {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--2xs);
                    min-width: 0;
                }
                .title-avatar {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                    border-radius: 4px;
                    font-size: 12px;
                    color: var(--color--neutral-800);
                    flex-shrink: 0;
                }
                .title {
                    font-size: var(--font-size--md);
                    font-weight: var(--font-weight--semibold);
                    color: var(--color--neutral-800);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    margin: 0;
                }

                .content {
                    flex: 1;
                    min-height: 0;
                    overflow-y: auto;
                    padding: var(--spacing--xl) var(--spacing--md);
                }
                .content-inner {
                    max-width: 880px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing--xl);
                }

                .section {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing--3xs);
                }
                .section-title {
                    font-size: var(--font-size--sm);
                    font-weight: var(--font-weight--semibold);
                    color: var(--color--neutral-800);
                    margin: 0 0 var(--spacing--3xs);
                }
                .field-label {
                    font-size: var(--font-size--xs);
                    color: var(--color--neutral-700);
                }

                /* Icon + name input row */
                .icon-name-row {
                    display: flex;
                    gap: var(--spacing--3xs);
                    align-items: stretch;
                    width: 100%;
                }
                .icon-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 36px;
                    height: 36px;
                    border: 1px solid
                        var(--border-color--base, var(--color--neutral-200));
                    background: white;
                    border-radius: var(--radius--3xs);
                    cursor: pointer;
                    padding: 0;
                    transition: border-color var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .icon-btn:hover {
                    border-color: var(--color--neutral-400);
                }
                .icon-preview {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                    border-radius: 4px;
                    font-size: 14px;
                }

                /* Inputs */
                .text-input {
                    flex: 1;
                    height: 36px;
                    padding: 0 var(--spacing--2xs);
                    border: 1px solid
                        var(--border-color--base, var(--color--neutral-200));
                    background: white;
                    border-radius: var(--radius--3xs);
                    font-size: var(--font-size--xs);
                    color: var(--color--neutral-800);
                    outline: none;
                    transition: border-color var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .text-input:focus,
                .textarea-input:focus,
                .search-input:focus {
                    border-color: var(--color--neutral-500);
                }
                .textarea-input {
                    width: 100%;
                    padding: var(--spacing--2xs);
                    border: 1px solid
                        var(--border-color--base, var(--color--neutral-200));
                    background: white;
                    border-radius: var(--radius--3xs);
                    font-family: inherit;
                    font-size: var(--font-size--xs);
                    color: var(--color--neutral-800);
                    outline: none;
                    resize: vertical;
                    transition: border-color var(--duration--snappy)
                        var(--easing--ease-out);
                }

                /* Vaults toolbar */
                .vaults-toolbar {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--xs);
                    margin-bottom: var(--spacing--2xs);
                }
                .search-input-wrap {
                    position: relative;
                    flex: 0 0 280px;
                }
                .search-input-wrap :global(svg) {
                    position: absolute;
                    left: var(--spacing--2xs);
                    top: 50%;
                    transform: translateY(-50%);
                    width: 14px;
                    height: 14px;
                    color: var(--color--neutral-500);
                    pointer-events: none;
                }
                .search-input {
                    width: 100%;
                    height: 32px;
                    padding: 0 var(--spacing--2xs) 0 32px;
                    border: 1px solid
                        var(--border-color--base, var(--color--neutral-200));
                    background: white;
                    border-radius: var(--radius--3xs);
                    font-size: var(--font-size--xs);
                    color: var(--color--neutral-800);
                    outline: none;
                    transition: border-color var(--duration--snappy)
                        var(--easing--ease-out);
                }

                .secondary-btn {
                    height: 32px;
                    padding: 0 var(--spacing--xs);
                    border: 1px solid
                        var(--border-color--base, var(--color--neutral-200));
                    background: white;
                    border-radius: var(--radius--3xs);
                    color: var(--color--neutral-800);
                    cursor: pointer;
                    font-size: var(--font-size--xs);
                    white-space: nowrap;
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out),
                        border-color var(--duration--snappy) var(--easing--ease-out);
                }
                .secondary-btn:hover {
                    background-color: var(--color--neutral-50);
                    border-color: var(--color--neutral-400);
                }
                .vaults-toolbar .secondary-btn {
                    margin-left: auto;
                }

                /* Vault table */
                .vault-table {
                    border: 1px solid
                        var(--border-color--light, var(--color--neutral-150));
                    border-radius: var(--radius--3xs);
                    overflow: hidden;
                    background: white;
                }
                .vault-table-head {
                    padding: var(--spacing--2xs) var(--spacing--xs);
                    background-color: var(--color--neutral-50);
                    border-bottom: 1px solid
                        var(--border-color--light, var(--color--neutral-150));
                    font-size: var(--font-size--3xs);
                    font-weight: var(--font-weight--semibold);
                    color: var(--color--neutral-500);
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                }
                .vault-row {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--2xs);
                    padding: var(--spacing--xs);
                    border: 0;
                    background: transparent;
                    text-align: left;
                    cursor: pointer;
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .vault-row + .vault-row {
                    border-top: 1px solid
                        var(--border-color--light, var(--color--neutral-150));
                }
                .vault-row:hover {
                    background-color: var(--color--neutral-50);
                }
                .vault-row :global(svg.vault-chevron) {
                    width: 14px;
                    height: 14px;
                    color: var(--color--neutral-500);
                }
                .vault-name {
                    font-size: var(--font-size--xs);
                    font-weight: var(--font-weight--medium);
                    color: var(--color--neutral-800);
                }
                .vault-count {
                    font-size: var(--font-size--xs);
                    color: var(--color--neutral-500);
                }
                .vault-empty {
                    padding: var(--spacing--md);
                    text-align: center;
                    font-size: var(--font-size--xs);
                    color: var(--color--neutral-400);
                }

                /* Danger zone */
                .danger-zone {
                    padding-top: var(--spacing--md);
                    border-top: 1px solid
                        var(--border-color--light, var(--color--neutral-150));
                }
                .danger-copy {
                    font-size: var(--font-size--xs);
                    color: var(--color--neutral-700);
                    margin: 0 0 var(--spacing--xs);
                }
                .danger-zone .secondary-btn {
                    align-self: flex-start;
                }
            `}</style>
        </div>
    );
}
