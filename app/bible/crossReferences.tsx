import { useEffect } from "react";
import { BackHandler } from "react-native";
import { SQLiteProvider } from "expo-sqlite";
import { useLocalSearchParams, useRouter } from "expo-router";

import CrossReferences from "../../components/CrossReferences/CrossReferencesList";

import * as AppSettings from "../../constants/AppSettings";

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

  return (
    <SQLiteProvider databaseName={AppSettings.SQLiteConfigs.databaseName}>
      <CrossReferences verseId={verseN} />
    </SQLiteProvider>
  );
}
