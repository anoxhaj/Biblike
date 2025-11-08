import { useRouter, Link } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import { View, StyleSheet, Pressable, Text } from "react-native";

import * as Helper from "@/helpers/Helper";
import * as Styles from "@/constants/Styles";
import VersionsPicker from "./VersionsPicker";
import useColorScheme from "@/hooks/useColorScheme";

export default function ReferencesMenu({
  versionId,
  chapterId,
  bookId,
  bookName,
  chapterNumber,
}: {
  versionId: number;
  chapterId: number;
  bookId: number;
  bookName: string;
  chapterNumber: number;
}) {
  const router = useRouter();
  const goToChapterScreen = async (newChapterId: number) => {
    if (newChapterId > 0 && newChapterId <= 1189)
      router.replace(Helper.buildChapterUrl(versionId, newChapterId));
  };

  const theme = useColorScheme();
  const styles = BuildStyleSheet(theme);

  return (
    <>
      <View style={styles.borderContainer}>
        <View style={styles.referencesContainer}>
          <Pressable
            style={styles.linkContainer}
            onPress={() => goToChapterScreen(chapterId - 1)}
          >
            <Text>
              {chapterId == 1 ? (
                ""
              ) : (
                <Entypo
                  name="chevron-left"
                  size={21}
                  color={Styles.Colors[theme].primaryText}
                />
              )}
            </Text>
          </Pressable>
          <Link style={styles.mainLink} href={`references?bookId=${bookId}`}>
            {bookName + " " + chapterNumber}
          </Link>
          <Pressable
            style={styles.linkContainer}
            onPress={() => goToChapterScreen(chapterId + 1)}
          >
            <Text>
              {chapterId == 1189 ? (
                ""
              ) : (
                <Entypo
                  name="chevron-right"
                  size={21}
                  color={Styles.Colors[theme].primaryText}
                />
              )}
            </Text>
          </Pressable>
        </View>
        <VersionsPicker chapterId={chapterId}></VersionsPicker>
      </View>
    </>
  );
}

function BuildStyleSheet(theme: "dark" | "light") {
  return StyleSheet.create({
    borderContainer: {
      paddingVertical: 12,
      paddingHorizontal: 12,
      height: 70,
      borderTopWidth: 1,
      borderTopColor: Styles.Colors[theme].secondaryBackground,
      flexDirection: "row",
      justifyContent: "space-evenly",
      gap: 6,
      alignItems: "center",
      backgroundColor: Styles.Colors[theme].primaryBackground,
    },
    referencesContainer: {
      backgroundColor: Styles.Colors[theme].secondaryBackground,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: 21,
      padding: 6,
      height: 50,
      flex: 1,
    },
    mainLink: {
      fontSize: Styles.Font.size,
      fontFamily: Styles.Font.bold,
      color: Styles.Colors[theme].primaryText,
    },
    linkContainer: {
      width: 40,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 6,
    },
  });
}
