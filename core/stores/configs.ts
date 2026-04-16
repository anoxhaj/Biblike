import { create } from 'zustand';
import { SQLiteDatabase } from 'expo-sqlite';

import * as c from '@/core/repositories/Configs';
import * as vvwl from '@/core/repositories/VVersionsWithLanguage';

export interface Config {
  key: string;
  value: number;
}

export interface Configs {
  LANGUAGE: Config;
  VERSION: Config;
  CHAPTER: Config;
  VERSE: Config;
}

export interface ConfigsState {
  configs: Configs;
  versions: vvwl.VVersionsWithLanguage[];
  isLoaded: boolean;
  isLoading: boolean;
}

export interface ConfigsActions {
  updateConfig: (key: keyof Configs, value: number, db: SQLiteDatabase) => Promise<void>;

  loadConfigs: (db: SQLiteDatabase) => Promise<void>;

  getVersions: () => vvwl.VVersionsWithLanguage[];
  getCurrentVersion: () => number;
  getCurrentChapter: () => number;
  getCurrentLanguage: () => number;
  getCurrentVerse: () => number;

  setLoading: (loading: boolean) => void;
}

export interface ConfigsStore extends ConfigsState, ConfigsActions {}

export const initialConfigs: Configs = {
  LANGUAGE: { key: 'LANGUAGE', value: 2 },
  VERSION: { key: 'VERSION', value: 1 },
  CHAPTER: { key: 'CHAPTER', value: 1 },
  VERSE: { key: 'VERSE', value: 1 },
};

const initialState: ConfigsState = {
  configs: initialConfigs,
  versions: [],
  isLoaded: false,
  isLoading: false,
};

export const useConfigsStore = create<ConfigsStore>((set, get) => ({
  ...initialState,

  updateConfig: async (key: keyof Configs, value: number, db: SQLiteDatabase) => {
    try {
      await c.UpdateAsync(db, { key, value: value.toString() });

      set((state) => ({
        configs: {
          ...state.configs,
          [key]: { ...state.configs[key], value },
        },
      }));
    } catch (error) {
      console.error('Failed to update config:', error);
      throw error;
    }
  },

  loadConfigs: async (db: SQLiteDatabase) => {
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
          newConfigs[key as keyof Configs].value = parseInt(value);
        }
      });

      set({
        configs: newConfigs,
        versions: versionsResult,
        isLoaded: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to load  Configs:', error);
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

export const useConfigs = () => useConfigsStore((state) => state.configs);
export const useVersions = () => useConfigsStore((state) => state.versions);
export const useCurrentVersion = () => useConfigsStore((state) => state.configs.VERSION.value);
export const useCurrentChapter = () => useConfigsStore((state) => state.configs.CHAPTER.value);
export const useCurrentLanguage = () => useConfigsStore((state) => state.configs.LANGUAGE.value);
export const useCurrentVerse = () => useConfigsStore((state) => state.configs.VERSE.value);
export const useConfigsLoading = () => useConfigsStore((state) => state.isLoading);

export const useUpdateConfig = () => useConfigsStore((state) => state.updateConfig);
export const useLoadConfigs = () => useConfigsStore((state) => state.loadConfigs);
