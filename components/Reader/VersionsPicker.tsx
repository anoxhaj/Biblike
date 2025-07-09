import { useState } from "react";
import { useRouter } from "expo-router";
import { openDatabaseAsync } from "expo-sqlite";
import { View, Text, StyleSheet } from "react-native";
import RNPickerSelect from "react-native-picker-select";

import * as Helper from "../../helpers/Helper";
import * as Styles from "../../constants/Styles";
import useColorScheme from "../../hooks/useColorScheme";
import * as AppSettings from "../../constants/AppSettings";
import * as vvwl from "../../models/VVersionsWithLanguage";

export default function VersionsPicker({ chapterId }: { chapterId: number }) {
  const router = useRouter();
  const theme = useColorScheme();
  const styles = BuildStyleSheet(theme);

  const [selectedVersion, setSelectedVersion] = useState<number | null>(
    AppSettings.CONFIGS.VERSION.value
  );

  const handleVersionChange = async (value: number) => {
    if (value === AppSettings.CONFIGS.VERSION.value) return;

    setSelectedVersion(value);
    const db = await openDatabaseAsync(AppSettings.SQLiteConfigs.databaseName);
    await AppSettings.CONFIGS.VERSION.SetAsync(db, Number(value));
    router.replace(
      Helper.buildChapterUrl(AppSettings.CONFIGS.VERSION.value, chapterId)
    );
    await db.closeAsync();
  };

  const getAbbreviation = (id: number | null) => {
    const found = AppSettings.Versions.find((v) => v.id === id);
    return found?.abbreviation || "Select Version";
  };

  const versions = AppSettings.Versions.map(
    (v: vvwl.VVersionsWithLanguage) => ({
      label: `${v.name} (${v.abbreviation}) ${v.year}`,
      value: v.id,
    })
  );

  return (
    <View style={styles.circleWrapper}>
      <Text style={styles.circleText}>{getAbbreviation(selectedVersion)}</Text>
      <RNPickerSelect
        onValueChange={handleVersionChange}
        items={versions}
        value={selectedVersion}
        useNativeAndroidPickerStyle={false}
        placeholder={{}}
        style={circlePickerStyles(Styles.Colors[theme])}
      />
    </View>
  );
}

const WIDTH = 60;
const HEIGHT = 50;

const circlePickerStyles = (
  colors: typeof Styles.Colors.light | typeof Styles.Colors.dark
) =>
  StyleSheet.create({
    inputIOS: {
      width: WIDTH,
      borderRadius: 21,
      padding: 6,
      height: HEIGHT,
      backgroundColor: colors.secondaryBackground,
      color: "transparent",
      fontFamily: Styles.Font.regular,
    },
    inputAndroid: {
      width: WIDTH,
      borderRadius: 21,
      padding: 6,
      height: HEIGHT,
      backgroundColor: colors.secondaryBackground,
      color: "transparent",
    },
    iconContainer: {
      display: "none",
    },
  });

function BuildStyleSheet(theme: "dark" | "light") {
  return StyleSheet.create({
    container: {
      marginVertical: 16,
      alignItems: "center",
    },
    label: {
      fontSize: 16,
      marginBottom: 10,
      fontWeight: "600",
      color: Styles.Colors[theme].primaryText,
    },
    circleWrapper: {
      position: "relative",
      width: WIDTH,
      height: HEIGHT,
      borderRadius: 21,
      justifyContent: "center",
      alignItems: "center",
    },
    circleText: {
      position: "absolute",
      zIndex: 1,
      fontSize: 18,
      color: Styles.Colors[theme].primaryText,
      textAlign: "center",
      textAlignVertical: "center",
      width: WIDTH,
      height: HEIGHT,
      fontFamily: Styles.Font.regular,
    },
  });
}
