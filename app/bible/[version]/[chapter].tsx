import { useEffect } from "react";
import { BackHandler } from "react-native";
import { SQLiteProvider } from "expo-sqlite";
import { useLocalSearchParams } from "expo-router";

import Reader from "../../../components/Reader/Reader";

import * as AppSettings from "../../../constants/AppSettings";

export default function ChapterScreen() {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        return true;
      }
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  const { version, chapter } = useLocalSearchParams();
  const chapterN = Number(chapter);
  const versionN = Number(version);

  return (
    <SQLiteProvider databaseName={AppSettings.SQLiteConfigs.databaseName}>
      <Reader versionId={versionN} chapterId={chapterN}></Reader>
    </SQLiteProvider>
  );
}
