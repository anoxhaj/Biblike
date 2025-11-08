import { create } from "zustand";
import { SQLiteDatabase } from "expo-sqlite";

import * as c from "@/repositories/Configs";
import * as vvwl from "@/repositories/VVersionsWithLanguage";

export interface AppConfig {
  key: string;
  value: number;
}

export interface AppConfigs {
  LANGUAGE: AppConfig;
  VERSION: AppConfig;
  CHAPTER: AppConfig;
  VERSE: AppConfig;
}

export interface AppSettingsState {
  configs: AppConfigs;
  versions: vvwl.VVersionsWithLanguage[];
  isLoaded: boolean;
  isLoading: boolean;
}

export interface AppSettingsActions {
  updateConfig: (
    key: keyof AppConfigs,
    value: number,
    db: SQLiteDatabase
  ) => Promise<void>;

  loadSettings: (db: SQLiteDatabase) => Promise<void>;

  getVersions: () => vvwl.VVersionsWithLanguage[];
  getCurrentVersion: () => number;
  getCurrentChapter: () => number;
  getCurrentLanguage: () => number;
  getCurrentVerse: () => number;

  setLoading: (loading: boolean) => void;
}

export interface AppSettingsStore
  extends AppSettingsState,
    AppSettingsActions {}

export const initialConfigs: AppConfigs = {
  LANGUAGE: { key: "LANGUAGE", value: 2 },
  VERSION: { key: "VERSION", value: 1 },
  CHAPTER: { key: "CHAPTER", value: 1 },
  VERSE: { key: "VERSE", value: 1 },
};

const initialState: AppSettingsState = {
  configs: initialConfigs,
  versions: [],
  isLoaded: false,
  isLoading: false,
};

export const useAppSettingsStore = create<AppSettingsStore>((set, get) => ({
  ...initialState,

  updateConfig: async (
    key: keyof AppConfigs,
    value: number,
    db: SQLiteDatabase
  ) => {
    try {
      await c.UpdateAsync(db, { key, value: value.toString() });

      set((state) => ({
        configs: {
          ...state.configs,
          [key]: { ...state.configs[key], value },
        },
      }));
    } catch (error) {
      console.error("Failed to update config:", error);
      throw error;
    }
  },

  loadSettings: async (db: SQLiteDatabase) => {
    try {
      set((state) => ({ ...state, isLoading: true }));

      const [configsResult, versionsResult] = await Promise.all([
        c.GetAllAsync(db),
        vvwl.GetAllAsync(db),
      ]);

      const newConfigs = { ...initialConfigs };

      configsResult.forEach((config) => {
        const { key, value } = config;
        if (key in newConfigs) {
          newConfigs[key as keyof AppConfigs].value = parseInt(value);
        }
      });

      set({
        configs: newConfigs,
        versions: versionsResult,
        isLoaded: true,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to load app settings:", error);
      set((state) => ({ ...state, isLoading: false }));
    }
  },

  getVersions: () => get().versions,
  getCurrentVersion: () => get().configs.VERSION.value,
  getCurrentChapter: () => get().configs.CHAPTER.value,
  getCurrentLanguage: () => get().configs.LANGUAGE.value,
  getCurrentVerse: () => get().configs.VERSE.value,

  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));

export const useAppConfigs = () =>
  useAppSettingsStore((state) => state.configs);
export const useAppVersions = () =>
  useAppSettingsStore((state) => state.versions);
export const useCurrentVersion = () =>
  useAppSettingsStore((state) => state.configs.VERSION.value);
export const useCurrentChapter = () =>
  useAppSettingsStore((state) => state.configs.CHAPTER.value);
export const useCurrentLanguage = () =>
  useAppSettingsStore((state) => state.configs.LANGUAGE.value);
export const useCurrentVerse = () =>
  useAppSettingsStore((state) => state.configs.VERSE.value);
export const useSettingsLoading = () =>
  useAppSettingsStore((state) => state.isLoading);

export const useUpdateConfig = () =>
  useAppSettingsStore((state) => state.updateConfig);
export const useLoadSettings = () =>
  useAppSettingsStore((state) => state.loadSettings);
