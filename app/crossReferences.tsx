import { useEffect } from "react";
import { BackHandler } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import CrossReferences from "@/components/CrossReferences/CrossReferencesList";

export default function CrossReferencesScreen() {
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

  const { verseId } = useLocalSearchParams();
  const verseN = Number(verseId);

  return <CrossReferences verseId={verseN} />;
}
