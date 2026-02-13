import SearchScreen from '@/core/screens/SearchScreen';
import { Router, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { BackHandler } from 'react-native';

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
