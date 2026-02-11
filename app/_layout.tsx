import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import * as NavigationBar from "expo-navigation-bar";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import { STYLES } from "@/core/constants";

import { useColorSchemeDefault } from "@/core/hooks";
import { useConfigsLoading, useConfigsStore } from "@/core/stores/configs";
import { Stack } from "expo-router";

SplashScreen.preventAutoHideAsync();

function SplashScreenHandler() {
  const isLoadingSettings = useConfigsLoading();

  const loadedFont = useFonts({
    SerifBold: require("@/assets/fonts/serifBold.ttf"),
    SerifItalic: require("@/assets/fonts/serifItalic.ttf"),
    SerifRegular: require("@/assets/fonts/serifRegular.ttf"),
  });

  useEffect(() => {
    if (loadedFont && !isLoadingSettings) {
      SplashScreen.hideAsync();
    }
  }, [loadedFont, isLoadingSettings]);

  return null;
}

function AppContent() {
  const theme = useColorSchemeDefault();

  useEffect(() => {
    const navBarColor = async () => {
      await NavigationBar.setButtonStyleAsync(
        theme === "dark" ? "light" : "dark",
      );
    };
    navBarColor();
  }, [theme]);

  const loadData = async (db: SQLiteDatabase) => {
    const store = useConfigsStore.getState();
    await store.loadConfigs(db);
  };

  return (
    <ThemeProvider value={theme === "dark" ? DarkTheme : DefaultTheme}>
      <StatusBar
        style="auto"
        backgroundColor={theme === "dark" ? "#0C080C" : "#F7F3F7"}
      />
      <SplashScreenHandler />
      <SQLiteProvider
        databaseName="database.db"
        assetSource={{ assetId: require("@/assets/database.db") }}
        onInit={loadData}
      >
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: STYLES.COLORS[theme].BACKGROUND.PRIMARY,
            },
            headerTitleStyle: {
              fontFamily: STYLES.FONT.BOLD,
              fontSize: 21,
            },
            contentStyle: {
              backgroundColor: theme === "dark" ? "#0C080C" : "#F7F3F7",
            },
            animation: "none",
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="references"
            options={{
              headerTitle: "References",
            }}
          />
          <Stack.Screen
            name="crossReferences"
            options={{
              headerTitle: "Cross References",
            }}
          />
          <Stack.Screen
            name="read"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="search"
            options={{
              headerTitle: "Search",
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      </SQLiteProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return <AppContent />;
}
