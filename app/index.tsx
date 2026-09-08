import { useFocusEffect, useRouter } from 'expo-router';

import { useCurrentChapter, useCurrentVersion } from '@/core/stores/configs';
import { urlBuilder } from '@/core/utils';

export default function HomeRoute() {
  const router = useRouter();
  const currentVersion = useCurrentVersion();
  const currentChapter = useCurrentChapter();

  useFocusEffect(() => {
    const url = urlBuilder.chapter(currentVersion, currentChapter);
    router.replace(url);
  });

  return <></>;
}
