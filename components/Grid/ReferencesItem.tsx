import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import Animated, { LinearTransition } from "react-native-reanimated";

import * as Helper from "@/helpers/Helper";
import * as Styles from "@/constants/Styles";
import useColorScheme from "@/hooks/useColorScheme";
import { useCurrentVersion } from "@/constants/store";
import * as vbwc from "@/repositories/VBookWithChapters";

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
  const currentVersion = useCurrentVersion();
  const theme = useColorScheme();
  const styles = BuildStyleSheet(theme);

  const toggleExpand = () => {
    onExpansion(index);
  };

  const goToChapterScreen = (chapterId: number) => {
    router.dismissAll();
    router.replace(Helper.buildChapterUrl(currentVersion, chapterId));
  };

  const isExpanded = expandedIndex === index;
  const chapters = isExpanded ? item.chapters : [];

  return (
    <Animated.View
      style={styles.expandable}
      layout={LinearTransition.springify()}
    >
      <TouchableOpacity onPress={toggleExpand} style={styles.titleContainer}>
        <Text style={styles.title}>{item.bookName}</Text>
      </TouchableOpacity>
      <Animated.View style={styles.row} layout={LinearTransition.springify()}>
        {chapters.map((chapter) => (
          <Pressable
            key={chapter.chapterId}
            style={styles.square}
            onPress={() => goToChapterScreen(chapter.chapterId)}
          >
            <Text style={styles.content}>{chapter.chapterNo}</Text>
          </Pressable>
        ))}
      </Animated.View>
    </Animated.View>
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
