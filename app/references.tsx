import { useEffect } from "react";
import { BackHandler } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import ReferencesGrid from "@/components/Grid/ReferencesGrid";

export default function ReferencesScreen() {
  const router = useRouter();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        router.dismissAll();
        return true;
      }
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  const { bookId } = useLocalSearchParams();
  const bookN = Number(bookId);

  return <ReferencesGrid bookId={bookN} />;
}
