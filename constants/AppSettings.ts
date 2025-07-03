import { SQLiteDatabase } from "expo-sqlite";

import * as c from "../models/Configs";

export let UP_TO_DATE: boolean = false;

export let CONFIGS: any = {
  LANGUAGE: {
    key: "LANGUAGE",
    value: 2,
    SetAsync: async function SetAsync(db: SQLiteDatabase, value: number) {
      this.value = value;
      c.UpdateAsync(db, { key: this.key, value: this.value.toString() });
    },
  },
  VERSION: {
    key: "VERSION",
    value: 1,
    SetAsync: async function SetAsync(db: SQLiteDatabase, value: number) {
      this.value = value;
      c.UpdateAsync(db, { key: this.key, value: this.value.toString() });
    },
  },
  CHAPTER: {
    key: "CHAPTER",
    value: 1,
    SetAsync: async function SetAsync(db: SQLiteDatabase, value: number) {
      this.value = value;
      c.UpdateAsync(db, { key: this.key, value: this.value.toString() });
    },
  },
  VERSE: {
    key: "VERSE",
    value: 1,
    SetAsync: async function SetAsync(db: SQLiteDatabase, value: number) {
      this.value = value;
      // c.UpdateAsync(db, { key: this.key, value: this.value.toString() });
    },
  },
};

export function MapConfigs(configs: c.Configs[]) {
  UP_TO_DATE = true;

  configs.forEach((config) => {
    const { key, value } = config;
    if (key in CONFIGS) {
      CONFIGS[key].value = parseInt(value);
    }
  });
}

export const SQLiteConfigs = {
  databaseName: "database.db",
  assetId: require("../database/database.db"),
};
