import { create } from "zustand";

interface EditorPanelStore {
  taskTitle: string | null;
  taskDescription: string | null;
  taskSource: "ai" | "pool" | null;
  aiHint: string | null;
  isRunning: boolean;
  isGenerating: boolean;
  isLoadingHint: boolean;
  canProceed: boolean;
  remainingGenerations: number;
  lastCheckFailed: boolean;
  nextLessonLabel: string;
  onCheck: (() => void) | null;
  onGenerate: (() => void) | null;
  onHint: (() => void) | null;
  onNext: (() => void) | null;
  update: (s: Partial<Omit<EditorPanelStore, "update" | "reset">>) => void;
  reset: () => void;
}

const defaults: Omit<EditorPanelStore, "update" | "reset"> = {
  taskTitle: null,
  taskDescription: null,
  taskSource: null,
  aiHint: null,
  isRunning: false,
  isGenerating: false,
  isLoadingHint: false,
  canProceed: false,
  remainingGenerations: 3,
  lastCheckFailed: false,
  nextLessonLabel: "Дальше →",
  onCheck: null,
  onGenerate: null,
  onHint: null,
  onNext: null,
};

export const useEditorPanelStore = create<EditorPanelStore>((set) => ({
  ...defaults,
  update: (s) => set((prev) => ({ ...prev, ...s })),
  reset: () => set((prev) => ({ ...prev, ...defaults })),
}));
