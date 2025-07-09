import { useRouter, Link } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import { View, StyleSheet, Pressable, Text } from "react-native";

import VersionsPicker from "./VersionsPicker";
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
      height: 70,
      borderTopWidth: 1,
      borderTopColor: Styles.Colors[theme].secondaryBackground,
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      backgroundColor: Styles.Colors[theme].primaryBackground,
    },
    referencesContainer: {
      backgroundColor: Styles.Colors[theme].secondaryBackground,
      flexDirection: "row",
      justifyContent: "space-between",
      borderRadius: 21,
      padding: 6,
      height: 50,
      width: 300,
    },
    mainLink: {
      fontSize: Styles.Font.size,
      paddingHorizontal: 60,
      paddingVertical: 6,
      backgroundColor: Styles.Colors[theme].secondaryBackground,
      fontFamily: Styles.Font.regular,
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
