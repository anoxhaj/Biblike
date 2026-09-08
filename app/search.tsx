import { useEffect } from 'react';

import { BackHandler } from 'react-native';

import { useRouter } from 'expo-router';

import SearchScreen from '@/core/screens/SearchScreen';

export default function SearchRoute() {
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

  return <SearchScreen />;
}
