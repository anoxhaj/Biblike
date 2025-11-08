import { useEffect } from "react";
import { BackHandler } from "react-native";
import { useLocalSearchParams } from "expo-router";

import Reader from "@/components/Reader/Reader";

export default function ReadScreen() {
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

  const { versionId, chapterId } = useLocalSearchParams();
  const chapterN = Number(chapterId);
  const versionN = Number(versionId);

  return <Reader versionId={versionN} chapterId={chapterN}></Reader>;
}
