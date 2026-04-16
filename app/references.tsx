import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import ReferencesScreen from '@/core/screens/ReferencesScreen';

export default function ReferencesRoute() {
  const router = useRouter();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      router.dismissAll();
      return true;
    });

    return () => {
      backHandler.remove();
    };
  }, [router]);

  const { bookId } = useLocalSearchParams();
  const bookN = Number(bookId);

  return <ReferencesScreen bookId={bookN} />;
}
