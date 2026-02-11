import { useRouter, Link } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { urlBuilder } from "@/core/utils";
import { STYLES } from "@/core/constants";
import VersionsPicker from "./VersionsPicker";
import { useColorSchemeDefault } from "@/core/hooks";

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
      router.replace(urlBuilder.chapter(versionId, newChapterId));
  };

  const goToSearchScreen = () => {
    router.push(urlBuilder.search());
  };

  const theme = useColorSchemeDefault();
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
                  color={STYLES.COLORS[theme].TEXT.PRIMARY}
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
                  color={STYLES.COLORS[theme].TEXT.PRIMARY}
                />
              )}
            </Text>
          </Pressable>
        </View>
        <Pressable style={styles.searchButton} onPress={goToSearchScreen}>
          <Ionicons
            name="search"
            size={24}
            color={STYLES.COLORS[theme].TEXT.PRIMARY}
          />
        </Pressable>
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
      borderTopColor: STYLES.COLORS[theme].BACKGROUND.SECONDARY,
      flexDirection: "row",
      justifyContent: "space-evenly",
      gap: 6,
      alignItems: "center",
      backgroundColor: STYLES.COLORS[theme].BACKGROUND.PRIMARY,
    },
    referencesContainer: {
      backgroundColor: STYLES.COLORS[theme].BACKGROUND.SECONDARY,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: 21,
      padding: 6,
      height: 50,
      flex: 1,
    },
    mainLink: {
      fontSize: 21,
      fontFamily: STYLES.FONT.BOLD,
      color: STYLES.COLORS[theme].TEXT.PRIMARY,
    },
    linkContainer: {
      width: 40,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 6,
    },
    searchButton: {
      width: 50,
      height: 50,
      backgroundColor: STYLES.COLORS[theme].BACKGROUND.SECONDARY,
      borderRadius: 25,
      justifyContent: "center",
      alignItems: "center",
    },
  });
}
