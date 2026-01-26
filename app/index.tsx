import { useRouter, useFocusEffect } from "expo-router";

import { urlBuilder } from "@/utils";
import { useCurrentVersion, useCurrentChapter } from "@/stores/configs";

export default function HomeScreen() {
  const router = useRouter();
  const currentVersion = useCurrentVersion();
  const currentChapter = useCurrentChapter();

  useFocusEffect(() => {
    const url = urlBuilder.chapter(currentVersion, currentChapter);
    router.replace(url);
  });

  return <></>;
}
