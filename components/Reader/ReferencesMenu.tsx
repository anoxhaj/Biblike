import { View, StyleSheet, Pressable, Text } from "react-native";
import { useRouter, Link } from "expo-router";

import * as Helper from "../../helpers/Helper";

import * as Styles from "../../constants/Styles";
import useColorScheme from "../../hooks/useColorScheme";

export default function ReferencesMenu({
  versionId,
  chapterId,
  bookName,
  chapterNumber,
}: {
  versionId: number;
  chapterId: number;
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
            <Text style={styles.link}>{chapterId == 1 ? "" : "{"}</Text>
          </Pressable>
          <Link style={styles.mainLink} href="bible/references">
            {bookName + " " + chapterNumber}
          </Link>
          <Pressable
            style={styles.linkContainer}
            onPress={() => goToChapterScreen(chapterId + 1)}
          >
            <Text style={styles.link}>{chapterId == 1189 ? "" : "}"}</Text>
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
      position: "absolute",
      bottom: 0,
      width: "100%",
    },
    referencesContainer: {
      backgroundColor: Styles.Colors[theme].secondaryBackground,
      flexDirection: "row",
      justifyContent: "space-between",
      borderRadius: 24,
      padding: 6,
      width: "80%",
    },
    mainLink: {
      fontSize: 21,
      borderRadius: 24,
      paddingHorizontal: 12,
      paddingVertical: 6,
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
