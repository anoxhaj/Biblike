import { useEffect } from "react";
import { BackHandler } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";

import Reader from "../../../../components/Reader/Reader";

import * as AppSettings from "../../../../constants/AppSettings";

export default function ChapterScreen() {
  const router = useRouter();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        router.replace("/");
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
