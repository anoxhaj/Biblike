import { useEffect } from "react";
import { BackHandler } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";

import ReferencesGrid from "../../components/Grid/ReferencesGrid";
import * as AppSettings from "../../constants/AppSettings";

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

  return (
    <SQLiteProvider databaseName={AppSettings.SQLiteConfigs.databaseName}>
      <ReferencesGrid bookId={bookN} />
    </SQLiteProvider>
  );
}
