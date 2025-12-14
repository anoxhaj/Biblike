import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Biblike",
  slug: "biblike",
  version: "1.2.1",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  scheme: "biblike",
  splash: {
    image: "./assets/icon.png",
    resizeMode: "contain",
    backgroundColor: "#F7F3F7",
    dark: {
      image: "./assets/icon.png",
      backgroundColor: "#F7F3F7",
    },
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.anonymous.biblike",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#493149",
    },
    package: "com.anonymous.biblike",
  },
  plugins: [
    "expo-router",
    "expo´dev-client",
    [
      "expo-sqlite",
      {
        enableFTS: true,
        useSQLCipher: true,
        android: {
          enableFTS: false,
          useSQLCipher: false,
        },
        ios: {
          customBuildFlags: [
            "-DSQLITE_ENABLE_DBSTAT_VTAB=1 -DSQLITE_ENABLE_SNAPSHOT=1",
          ],
        },
      },
    ],
  ],
  extra: {
    eas: {
      projectId: "e6c8a8a6-bb16-40fa-8cf9-80c1f2b24724",
    },
  },
});
