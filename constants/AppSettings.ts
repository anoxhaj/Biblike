import * as c from "../models/Configs";

export let UP_TO_DATE: boolean = false;

export let CONFIGS: any = {
  LANGUAGE: {
    key: "LANGUAGE",
    value: 2,
  },
  VERSION: {
    key: "VERSION",
    value: 1,
  },
  BOOK: {
    key: "BOOK",
    value: 1,
  },
  CHAPTER: {
    key: "CHAPTER",
    value: 1,
  },
  VERSE: {
    key: "VERSE",
    value: 1,
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
