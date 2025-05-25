import { useCallback, useEffect, useState } from "react";
import { View, Text } from "react-native";
import {
  openDatabaseAsync,
  openDatabaseSync,
  SQLiteDatabase,
} from "expo-sqlite";
import { useFocusEffect } from "@react-navigation/native";

import * as c from "../../models/Configs";
import * as Styles from "../../constants/Styles";
import * as AppSettings from "../../constants/AppSettings";
import useColorScheme from "../../hooks/useColorScheme";

export default function SettingsScreen() {
  const theme = useColorScheme();
  let db: SQLiteDatabase = openDatabaseSync(
    AppSettings.SQLiteConfigs.databaseName
  );
  let [configs, setConfigs] = useState<c.Configs[]>([]);

  const fetchConfigs = useCallback(() => {
    async function fetch(): Promise<void> {
      db = await openDatabaseAsync(AppSettings.SQLiteConfigs.databaseName);
      setConfigs(await c.GetAllAsync(db));
    }

    fetch();
    db.closeAsync();
  }, [db]);

  useFocusEffect(() => {
    fetchConfigs();
  });

  return (
    <>
      <View
        style={{
          backgroundColor: Styles.Colors[theme].primaryBackground,
          height: "100%",
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
              {item.value}
            </Text>
          </View>
        ))}
      </View>
    </>
  );
}
