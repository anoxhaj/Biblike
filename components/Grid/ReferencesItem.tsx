import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";

import * as AppSettings from "../../constants/AppSettings";
import * as Styles from "../../constants/Styles";
import * as Helper from "../../helpers/Helper";
import * as vbwc from "../../models/VBookWithChapters";
import useColorScheme from "../../hooks/useColorScheme";

export default function ReferencesItem({
  index,
  item,
  expandedIndex,
  onExpansion,
}: {
  index: number;
  item: vbwc.VBookWithChapters;
  expandedIndex: number;
  onExpansion: any;
}) {
  const router = useRouter();
  const toggleExpand = () => {
    onExpansion(index);
  };

  const goToChapterScreen = (chapterId: number) => {
    router.dismissAll();
    router.replace(
      Helper.buildChapterUrl(AppSettings.CONFIGS.VERSION.value, chapterId)
    );
  };

  const theme = useColorScheme();
  const styles = BuildStyleSheet(theme);

  return (
    <View style={styles.expandable}>
      <TouchableOpacity onPress={toggleExpand} style={styles.titleContainer}>
        <Text style={styles.title}>{item.bookName}</Text>
      </TouchableOpacity>
      <View style={styles.row}>
        {expandedIndex == index &&
          item.chapters.map((chapter) => (
            <Pressable
              key={chapter.chapterId}
              style={styles.square}
              onPress={() => goToChapterScreen(chapter.chapterId)}
            >
              <Text key={chapter.chapterId} style={styles.content}>
                {chapter.chapterNo}
              </Text>
            </Pressable>
          ))}
      </View>
    </View>
  );
}

function BuildStyleSheet(theme: "dark" | "light") {
  const { width } = Dimensions.get("window");
  const responsiveWidth = (width - 86) / 6;
  return StyleSheet.create({
    expandable: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 12,
      backgroundColor: Styles.Colors[theme].primaryBackground,
      elevation: 3,
    },
    titleContainer: {
      overflow: "hidden",
    },
    title: {
      paddingVertical: 12,
      fontFamily: Styles.Font.regular,
      fontSize: Styles.Font.size,
      color: Styles.Colors[theme].primaryText,
    },
    row: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "flex-start",
      gap: 12,
    },
    square: {
      backgroundColor: Styles.Colors[theme].secondaryBackground,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 8,
      width: responsiveWidth,
      height: responsiveWidth,
    },
    content: {
      fontFamily: Styles.Font.regular,
      fontSize: 14,
      color: Styles.Colors[theme].primaryText,
    },
  });
}
