import { useRouter, useFocusEffect } from "expo-router";

import * as AppSettings from "../../constants/AppSettings";
import * as Helper from "../../helpers/Helper";

export default function BibleScreen() {
  const router = useRouter();

  useFocusEffect(() => {
    const url = Helper.buildChapterUrl(
      AppSettings.CONFIGS.VERSION.value,
      AppSettings.CONFIGS.CHAPTER.value
    );

    router.replace(url);
  });

  return <></>;
}
