import { View, StyleSheet, Pressable, Text } from "react-native";
import { useRouter, Link } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";

import * as Helper from "../../helpers/Helper";

import * as Styles from "../../constants/Styles";
import useColorScheme from "../../hooks/useColorScheme";

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
            <Text style={styles.link}>
              {chapterId == 1 ? (
                ""
              ) : (
                <Entypo
                  name="chevron-left"
                  size={24}
                  color={Styles.Colors[theme].primaryText}
                />
              )}
            </Text>
          </Pressable>
          <Link
            style={styles.mainLink}
            href={`bible/references?bookId=${bookId}`}
          >
            {bookName + " " + chapterNumber}
          </Link>
          <Pressable
            style={styles.linkContainer}
            onPress={() => goToChapterScreen(chapterId + 1)}
          >
            <Text style={styles.link}>
              {chapterId == 1189 ? (
                ""
              ) : (
                <Entypo
                  name="chevron-right"
                  size={24}
                  color={Styles.Colors[theme].primaryText}
                />
              )}
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

function BuildStyleSheet(theme: "dark" | "light") {
  return StyleSheet.create({
    borderContainer: {
      padding: 12,
      borderTopWidth: 1,
      borderTopColor: Styles.Colors[theme].secondaryBackground,
      flexDirection: "row",
      justifyContent: "center",
      backgroundColor: Styles.Colors[theme].primaryBackground,
    },
    referencesContainer: {
      backgroundColor: Styles.Colors[theme].secondaryBackground,
      flexDirection: "row",
      justifyContent: "space-between",
      borderRadius: 24,
      padding: 12,
      height: 50.9,
      width: 330,
    },
    mainLink: {
      fontSize: 21,
      borderRadius: 24,
      paddingHorizontal: 12,
      paddingVertical: 0,
      backgroundColor: Styles.Colors[theme].secondaryBackground,
      fontFamily: Styles.Font.bold,
      color: Styles.Colors[theme].primaryText,
    },
    linkContainer: {
      width: 33,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 6,
      fontFamily: Styles.Font.bold,
    },
    link: {
      fontSize: 21,
      backgroundColor: Styles.Colors[theme].secondaryBackground,
      fontFamily: Styles.Font.bold,
      color: Styles.Colors[theme].primaryText,
    },
  });
}
