"use client";

import { useStore } from "@/lib/store";
import {
    Home,
    User,
    Share2,
    MessageCircle,
    Cloud,
    PackageOpen,
    BarChart3,
    CircleHelp,
    Settings,
    Plus,
    Search,
    PanelLeft,
    Sparkles,
} from "lucide-react";
import { N8nLogo } from "./shared/n8n-logo";

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    badge?: string;
    compact?: boolean;
    hasNotification?: boolean;
    onClick?: () => void;
}

function NavItem({
    icon,
    label,
    active,
    badge,
    compact,
    hasNotification,
    onClick,
}: NavItemProps) {
    return (
        <button
            onClick={onClick}
            data-active={active ? "true" : undefined}
            className="n8n-menu-item"
        >
            <span className="icon">
                {hasNotification && <span className="dot" />}
                {icon}
            </span>
            {!compact && (
                <>
                    <span className="label">{label}</span>
                    {badge && <span className="badge">{badge}</span>}
                </>
            )}

            <style jsx>{`
                .n8n-menu-item {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                    padding: var(--spacing--4xs) var(--spacing--2xs);
                    border: 0;
                    background: transparent;
                    border-radius: var(--radius--3xs);
                    text-align: left;
                    height: var(--height--md);
                    color: var(--color--neutral-500);
                    cursor: pointer;
                    transition: background-color var(--duration--snappy) var(--easing--ease-out),
                        color var(--duration--snappy) var(--easing--ease-out);
                }
                .n8n-menu-item:hover {
                    background-color: var(--color--neutral-100);
                    color: var(--color--neutral-700);
                }
                .n8n-menu-item[data-active="true"] {
                    background-color: var(--color--neutral-100);
                    color: var(--color--neutral-800);
                    font-weight: var(--font-weight--bold);
                }
                .icon {
                    position: relative;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 20px;
                    height: 20px;
                }
                .icon :global(svg) {
                    width: 18px;
                    height: 18px;
                }
                .dot {
                    position: absolute;
                    right: -2px;
                    top: -2px;
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background-color: var(--color--orange-300);
                }
                .label {
                    flex: 1;
                    font-size: var(--font-size--xs);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .badge {
                    padding: 2px 6px;
                    font-size: var(--font-size--3xs);
                    background-color: var(--color--neutral-150);
                    color: var(--color--neutral-500);
                    border-radius: var(--radius--3xs);
                    line-height: 1;
                }
            `}</style>
        </button>
    );
}

function SectionLabel({ label }: { label: string }) {
    return (
        <div className="section-label">
            <span>{label}</span>

            <style jsx>{`
                .section-label {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-inline: var(--spacing--xs);
                    margin-top: var(--spacing--2xs);
                }
                span {
                    font-size: var(--font-size--2xs);
                    font-weight: var(--font-weight--bold);
                    color: var(--color--neutral-400);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            `}</style>
        </div>
    );
}

export function Sidebar() {
    const { currentScreen, setScreen } = useStore();

    return (
        <aside className="n8n-sidebar">
            {/* Header — matches MainSidebarHeader.vue */}
            <div className="header">
                <div className="logo-wrap">
                    <N8nLogo size={32} />
                </div>
                <button className="hdr-btn">
                    <Plus />
                </button>
                <button className="hdr-btn">
                    <Search />
                </button>
                <button className="hdr-btn">
                    <PanelLeft />
                </button>
            </div>

            {/* Scroll area */}
            <div className="scroll n8n-scrollbar">
                {/* Home section */}
                <div className="group">
                    <NavItem
                        icon={<Home />}
                        label="Overview"
                        active={currentScreen === "overview"}
                        onClick={() => setScreen("overview")}
                    />
                    <NavItem
                        icon={<User />}
                        label="Personal"
                        active={currentScreen === "personal"}
                        onClick={() => setScreen("personal")}
                    />
                    <NavItem
                        icon={<Share2 />}
                        label="Shared with you"
                        active={currentScreen === "shared"}
                        onClick={() => setScreen("shared")}
                    />
                    <NavItem
                        icon={<MessageCircle />}
                        label="Chat"
                        badge="beta"
                        active={currentScreen === "chat"}
                        onClick={() => setScreen("chat")}
                    />
                </div>

                {/* Projects section */}
                <SectionLabel label="Projects" />
                <div className="group">
                    <NavItem icon={<Sparkles />} label="Customer Support" />
                </div>
            </div>

            {/* Bottom menu — matches BottomMenu.vue */}
            <div className="bottom">
                <div className="group">
                    <NavItem icon={<Cloud />} label="Admin Panel" />
                    <NavItem icon={<PackageOpen />} label="Templates" />
                    <NavItem icon={<BarChart3 />} label="Insights" />
                    <NavItem icon={<CircleHelp />} label="Help" hasNotification />
                    <NavItem
                        icon={<Settings />}
                        label="Settings"
                        active={currentScreen === "settings"}
                        onClick={() => setScreen("settings")}
                    />
                </div>
            </div>

            <style jsx>{`
                .n8n-sidebar {
                    position: relative;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    width: 200px;
                    border-right: 1px solid var(--border-color--light, var(--color--neutral-150));
                    background-color: var(--menu--color--background, var(--color--neutral-50));
                }
                .header {
                    display: flex;
                    align-items: center;
                    padding: var(--spacing--2xs) var(--spacing--3xs);
                    gap: var(--spacing--4xs);
                }
                .logo-wrap {
                    margin-right: auto;
                    display: flex;
                    align-items: center;
                    padding-left: var(--spacing--2xs);
                }
                .hdr-btn {
                    padding: 6px;
                    border: 0;
                    background: transparent;
                    border-radius: var(--radius--3xs);
                    cursor: pointer;
                    transition: background-color var(--duration--snappy) var(--easing--ease-out);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .hdr-btn:hover {
                    background-color: var(--color--neutral-125);
                }
                .hdr-btn :global(svg) {
                    width: 16px;
                    height: 16px;
                    color: var(--color--neutral-500);
                }

                .scroll {
                    flex: 1;
                    min-height: 0;
                    display: flex;
                    flex-direction: column;
                    padding-top: var(--spacing--2xs);
                    overflow-y: auto;
                }
                .group {
                    padding-inline: var(--spacing--3xs);
                    padding-block: var(--spacing--2xs);
                }
                .bottom {
                    margin-top: auto;
                }
                .bottom .group {
                    padding-inline: var(--spacing--3xs);
                    padding-block: var(--spacing--3xs);
                }
            `}</style>
        </aside>
    );
}
