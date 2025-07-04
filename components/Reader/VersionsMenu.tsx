import { useCallback, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { useSQLiteContext } from "expo-sqlite";

import * as AppSettings from "../../constants/AppSettings";
import * as Helper from "../../helpers/Helper";
import * as Styles from "../../constants/Styles";
import useColorScheme from "../../hooks/useColorScheme";
import * as vvwl from "../../models/VVersionsWithLanguage";

export default function VersionsMenu({
  versionId,
  chapterId,
}: {
  versionId: number;
  chapterId: number;
}) {
  const router = useRouter();
  const db = useSQLiteContext();

  const [versions, setVersions] = useState<vvwl.VVersionsWithLanguage[]>([]);

  const fetchVersions = useCallback(() => {
    async function fetch() {
      await db.withExclusiveTransactionAsync(async () => {
        setVersions(await vvwl.GetAllAsync(db));
      });
    }
    fetch();
  }, [db]);

  useEffect(() => {
    fetchVersions();
  }, []);

  const theme = useColorScheme();
  const styles = BuildStyleSheet(theme);

  return (
    <>
      <View style={styles.container}>
        <View
          style={{
            marginTop: 30,
            width: 330,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderRadius: 21,
            backgroundColor: Styles.Colors[theme].secondaryBackground,
          }}
        >
          <Picker
            style={{
              height: "100%",
              color: Styles.Colors[theme].primaryText,
            }}
            dropdownIconColor={Styles.Colors[theme].primaryText}
            selectedValue={AppSettings.CONFIGS.VERSION.value}
            selectionColor="blue"
            onValueChange={async (itemValue, itemIndex) => {
              await AppSettings.CONFIGS.VERSION.SetAsync(db, Number(itemValue));
              router.replace(
                Helper.buildChapterUrl(
                  AppSettings.CONFIGS.VERSION.value,
                  chapterId
                )
              );
            }}
          >
            {versions.map((value: vvwl.VVersionsWithLanguage) => (
              <Picker.Item
                key={value.id}
                label={`${value.name} ${value.year} - ${value.abbreviation} (${value.languageName})`}
                value={value.id}
              />
            ))}
          </Picker>
        </View>
      </View>
    </>
  );
}

function BuildStyleSheet(theme: "dark" | "light") {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "center",
    },
  });
}
