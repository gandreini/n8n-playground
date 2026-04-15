"use client";

import { useStore, Screen } from "@/lib/store";
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
    ChevronRight,
    Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
            className={cn(
                "n8n-menu-item w-full flex items-center gap-[var(--spacing--3xs)] px-[var(--spacing--2xs)] py-[var(--spacing--4xs)] rounded-[var(--radius--3xs)] transition-snappy text-left h-[var(--height--md)]",
                active
                    ? "bg-[var(--color--neutral-100)] text-[color:var(--color--neutral-800)] font-[var(--font-weight--bold)]"
                    : "text-[color:var(--color--neutral-500)] hover:bg-[var(--color--neutral-100)] hover:text-[color:var(--color--neutral-700)]",
            )}
        >
            <span className="relative flex-shrink-0 flex items-center justify-center w-5 h-5">
                {hasNotification && (
                    <span className="absolute -right-0.5 -top-0.5 w-[6px] h-[6px] rounded-full bg-[var(--color--orange-300)]" />
                )}
                {icon}
            </span>
            {!compact && (
                <>
                    <span className="flex-1 text-[length:var(--font-size--xs)] truncate">
                        {label}
                    </span>
                    {badge && (
                        <span className="px-1.5 py-0.5 text-[length:var(--font-size--3xs)] bg-[var(--color--neutral-150)] text-[color:var(--color--neutral-500)] rounded-[var(--radius--3xs)] leading-none">
                            {badge}
                        </span>
                    )}
                </>
            )}
        </button>
    );
}

function SectionLabel({ label }: { label: string }) {
    return (
        <div className="flex justify-between items-center px-[var(--spacing--xs)] mt-[var(--spacing--2xs)]">
            <span className="text-[length:var(--font-size--2xs)] font-[var(--font-weight--bold)] text-[color:var(--color--neutral-400)] truncate">
                {label}
            </span>
        </div>
    );
}

export function Sidebar() {
    const { currentScreen, setScreen } = useStore();

    return (
        <aside className="n8n-sidebar relative h-full flex flex-col border-r border-[var(--border-color--light,var(--color--neutral-150))] bg-[var(--menu--color--background,var(--color--neutral-50))] w-[200px]">
            {/* Header — matches MainSidebarHeader.vue */}
            <div className="flex items-center px-[var(--spacing--3xs)] py-[var(--spacing--2xs)] gap-[var(--spacing--4xs)]">
                <div className="mr-auto flex items-center pl-2">
                    <N8nLogo size={32} />
                </div>
                <button className="n8n-button--highlight p-1.5 rounded-[var(--radius--3xs)] hover:bg-[var(--color--neutral-125)] transition-snappy">
                    <Plus className="w-4 h-4 text-[var(--color--neutral-500)]" />
                </button>
                <button className="n8n-button--highlight p-1.5 rounded-[var(--radius--3xs)] hover:bg-[var(--color--neutral-125)] transition-snappy">
                    <Search className="w-4 h-4 text-[var(--color--neutral-500)]" />
                </button>
                <button className="n8n-button--highlight p-1.5 rounded-[var(--radius--3xs)] hover:bg-[var(--color--neutral-125)] transition-snappy">
                    <PanelLeft className="w-4 h-4 text-[var(--color--neutral-500)]" />
                </button>
            </div>

            {/* Scroll area — matches ProjectNavigation.vue */}
            <div className="flex-1 min-h-0 flex flex-col pt-[var(--spacing--2xs)] overflow-y-auto n8n-scrollbar">
                {/* Home section */}
                <div className="px-[var(--spacing--3xs)] pb-[var(--spacing--2xs)]">
                    <NavItem
                        icon={<Home className="w-[18px] h-[18px]" />}
                        label="Overview"
                        active={currentScreen === "overview"}
                        onClick={() => setScreen("overview")}
                    />
                    <NavItem
                        icon={<User className="w-[18px] h-[18px]" />}
                        label="Personal"
                        active={currentScreen === "personal"}
                        onClick={() => setScreen("personal")}
                    />
                    <NavItem
                        icon={<Share2 className="w-[18px] h-[18px]" />}
                        label="Shared with you"
                        active={currentScreen === "shared"}
                        onClick={() => setScreen("shared")}
                    />
                    <NavItem
                        icon={<MessageCircle className="w-[18px] h-[18px]" />}
                        label="Chat"
                        badge="beta"
                        active={currentScreen === "chat"}
                        onClick={() => setScreen("chat")}
                    />
                </div>

                {/* Projects section */}
                <SectionLabel label="Projects" />
                <div className="px-[var(--spacing--3xs)] py-[var(--spacing--2xs)]">
                    <NavItem
                        icon={<Sparkles className="w-[18px] h-[18px]" />}
                        label="Customer Support"
                    />
                </div>
            </div>

            {/* Bottom menu — matches BottomMenu.vue */}
            <div className="mt-auto">
                <div className="px-[var(--spacing--3xs)] py-[var(--spacing--3xs)]">
                    <NavItem
                        icon={<Cloud className="w-[18px] h-[18px]" />}
                        label="Admin Panel"
                    />
                    <NavItem
                        icon={<PackageOpen className="w-[18px] h-[18px]" />}
                        label="Templates"
                    />
                    <NavItem
                        icon={<BarChart3 className="w-[18px] h-[18px]" />}
                        label="Insights"
                    />
                    <NavItem
                        icon={<CircleHelp className="w-[18px] h-[18px]" />}
                        label="Help"
                        hasNotification
                    />
                    <NavItem
                        icon={<Settings className="w-[18px] h-[18px]" />}
                        label="Settings"
                        active={currentScreen === "settings"}
                        onClick={() => setScreen("settings")}
                    />
                </div>
            </div>
        </aside>
    );
}
