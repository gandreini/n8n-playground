"use client";

import { ArrowLeft } from "lucide-react";
import { PROJECTS, type Project } from "./projects-data";

interface ProjectViewProps {
    projectId: string;
    onBack: () => void;
}

export function ProjectView({ projectId, onBack }: ProjectViewProps) {
    const project: Project =
        PROJECTS.find((p) => p.id === projectId) ?? PROJECTS[0];

    return (
        <div className="project-view">
            <aside className="sub-sidebar">
                <button className="back-btn" onClick={onBack}>
                    <ArrowLeft />
                    <span>Back</span>
                </button>
                <p className="placeholder">Sub-sidebar — {project.name}</p>
            </aside>

            <main className="main">
                <p className="placeholder">Main — {project.name}</p>
            </main>

            <aside className="artifacts">
                <p className="placeholder">Artifacts panel</p>
            </aside>

            <style jsx>{`
                .project-view {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    background-color: var(--color--background-base);
                }
                .sub-sidebar {
                    width: 240px;
                    flex-shrink: 0;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    border-right: 1px solid
                        var(--border-color--light, var(--color--neutral-150));
                    background-color: var(
                        --menu--color--background,
                        var(--color--neutral-50)
                    );
                    padding: var(--spacing--2xs);
                }
                .back-btn {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                    padding: var(--spacing--4xs) var(--spacing--2xs);
                    border: 0;
                    background: transparent;
                    border-radius: var(--radius--3xs);
                    color: var(--color--neutral-500);
                    cursor: pointer;
                    font-size: var(--font-size--xs);
                }
                .back-btn:hover {
                    background-color: var(--color--neutral-100);
                    color: var(--color--neutral-700);
                }
                .back-btn :global(svg) {
                    width: 14px;
                    height: 14px;
                }
                .main {
                    flex: 1;
                    min-width: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .artifacts {
                    width: 272px;
                    flex-shrink: 0;
                    height: 100%;
                    border-left: 1px solid
                        var(--border-color--subtle, var(--color--black-alpha-100));
                    background-color: var(--color--neutral-white);
                    padding: var(--spacing--sm);
                }
                .placeholder {
                    color: var(--color--neutral-400);
                    font-size: var(--font-size--xs);
                }
            `}</style>
        </div>
    );
}
