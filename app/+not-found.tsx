import { useRouter, useFocusEffect } from "expo-router";

import * as Helper from "@/helpers/Helper";
import { useCurrentVersion, useCurrentChapter } from "@/constants/store";

export default function NotFoundScreen() {
  const router = useRouter();
  const currentVersion = useCurrentVersion();
  const currentChapter = useCurrentChapter();

  useFocusEffect(() => {
    const url = Helper.buildChapterUrl(currentVersion, currentChapter);
    router.replace(url);
  });

  return <></>;
}
