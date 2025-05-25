import { useEffect } from "react";
import { BackHandler } from "react-native";
import { useRouter } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";

import CrossReferences from "../../../components/CrossReferences/CrossReferencesList";

import * as AppSettings from "../../../constants/AppSettings";

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

  return (
    <SQLiteProvider databaseName={AppSettings.SQLiteConfigs.databaseName}>
      <CrossReferences />
    </SQLiteProvider>
  );
}
