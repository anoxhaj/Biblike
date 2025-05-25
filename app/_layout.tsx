import { useState, useEffect, memo } from "react";
import { useColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import { Stack, useRootNavigationState } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { SQLiteDatabase, SQLiteProvider, openDatabaseAsync } from "expo-sqlite";

import * as AppSettings from "../constants/AppSettings";
import useColorSchemeDefault from "../hooks/useColorScheme";
import * as c from "../models/Configs";

import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, setLoaded] = useState(false);
  const theme = useColorSchemeDefault();

  const configDatabase = async () => {
    if (!loaded) {
      const dbName = "database.db";
      const dbAsset = AppSettings.SQLiteConfigs.assetId;
      const dbUri = Asset.fromModule(dbAsset).uri;
      const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

      try {
        const fileInfo = await FileSystem.getInfoAsync(dbFilePath);

        if (!fileInfo.exists) {
          await FileSystem.makeDirectoryAsync(
            `${FileSystem.documentDirectory}SQLite/`,
            { intermediates: true }
          );

          await FileSystem.downloadAsync(dbUri, dbFilePath);
          await RestoreConfigs();
        } else if (fileInfo.exists) {
          await RestoreConfigs();
        }
      } catch (err) {
        console.error(err);
      }
    }

    async function RestoreConfigs() {
      try {
        let db = await openDatabaseAsync("database.db");
        AppSettings.MapConfigs(await c.GetAllAsync(db));
        setLoaded(true);
      } catch {}
    }
  };

  const loadedFont = useFonts({
    SerifRegular: require("../assets/fonts/serifRegular.ttf"),
    SerifItalic: require("../assets/fonts/serifItalic.ttf"),
    SerifBold: require("../assets/fonts/serifBold.ttf"),
  });

  configDatabase();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (loaded) {
    return (
      <ThemeProvider value={theme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    );
  }

  return <></>;
}
