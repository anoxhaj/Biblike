import { useEffect } from "react";
import { BackHandler } from "react-native";
import { useLocalSearchParams } from "expo-router";

import ReadScreen from "@/core/screens/ReadScreen";

export default function Screen() {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        return true;
      },
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  const { versionId, chapterId } = useLocalSearchParams();
  const chapterN = Number(chapterId);
  const versionN = Number(versionId);

  return <ReadScreen versionId={versionN} chapterId={chapterN} />;
}
