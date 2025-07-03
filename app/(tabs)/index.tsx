import { useCallback, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { openDatabaseAsync } from "expo-sqlite";
import { useFocusEffect, useRoute } from "@react-navigation/native";

import * as c from "../../models/Configs";
import * as Styles from "../../constants/Styles";
import * as AppSettings from "../../constants/AppSettings";
import useColorScheme from "../../hooks/useColorScheme";
import React from "react";

export default function SettingsScreen() {
  const theme = useColorScheme();
  const [configs, setConfigs] = useState<c.Configs[]>([]);

  const fetchConfigs = useCallback(async () => {
    const database = await openDatabaseAsync(
      AppSettings.SQLiteConfigs.databaseName
    );
    const configData = await c.GetAllAsync(database);
    setConfigs(configData);
  }, []);

  const set = useCallback(async () => {
    const db = await openDatabaseAsync(AppSettings.SQLiteConfigs.databaseName);
    AppSettings.CONFIGS.VERSION.SetAsync(db, 2);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchConfigs();
    }, [fetchConfigs])
  );

  return (
    <>
      <View
        style={{
          backgroundColor: Styles.Colors[theme].primaryBackground,
          height: "100%",
          paddingTop: 30,
        }}
      >
        {configs.map((item, index) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 60,
              paddingVertical: 10,
              backgroundColor: Styles.Colors[theme].primaryBackground,
            }}
            key={index}
          >
            <Text style={{ color: Styles.Colors[theme].primaryText }}>
              {item.key}
            </Text>
            <Text style={{ color: Styles.Colors[theme].primaryText }}>
              DB: {item.value}
            </Text>
            <Text style={{ color: Styles.Colors[theme].primaryText }}>
              MEM: {AppSettings.CONFIGS[item.key].value}
            </Text>
          </View>
        ))}
      </View>
    </>
  );
}
