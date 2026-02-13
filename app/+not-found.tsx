import { useRouter, useFocusEffect } from 'expo-router';

import { urlBuilder } from '@/core/utils';
import { useCurrentVersion, useCurrentChapter } from '@/core/stores/configs';

export default function NotFoundScreen() {
  const router = useRouter();
  const currentVersion = useCurrentVersion();
  const currentChapter = useCurrentChapter();

  useFocusEffect(() => {
    const url = urlBuilder.chapter(currentVersion, currentChapter);
    router.replace(url);
  });

  return <></>;
}
