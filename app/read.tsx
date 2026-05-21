import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import ReadScreen from '@/core/screens/ReadScreen';

export default function ReadRoute() {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });

    return () => {
      backHandler.remove();
    };
  }, []);

  const { versionId, chapterId, verseId } = useLocalSearchParams();
  const chapterN = Number(chapterId);
  const versionN = Number(versionId);
  const verseN = Number(verseId);

  return <ReadScreen versionId={versionN} chapterId={chapterN} verseId={verseN} />;
}
