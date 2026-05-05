"use client";

import { create } from "zustand";
import { WORKSPACES } from "./workspaces-data";

interface WorkspaceStore {
    currentWorkspaceId: string;
    setCurrentWorkspaceId: (id: string) => void;
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
    currentWorkspaceId: WORKSPACES[0].id,
    setCurrentWorkspaceId: (id) => set({ currentWorkspaceId: id }),
}));
