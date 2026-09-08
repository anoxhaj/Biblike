import { Dimensions, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useRouter } from 'expo-router';

import Animated, { LinearTransition } from 'react-native-reanimated';

import { STYLES } from '@/core/constants';
import { useColorSchemeDefault } from '@/core/hooks';
import * as vbwc from '@/core/repositories/VBookWithChapters';
import { useCurrentVersion } from '@/core/stores/configs';
import { urlBuilder } from '@/core/utils';

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
  const theme = useColorSchemeDefault();
  const styles = BuildStyleSheet(theme);

  const toggleExpand = () => {
    onExpansion(index);
  };

  const goToChapterScreen = (chapterId: number) => {
    router.dismissAll();
    router.replace(urlBuilder.chapter(currentVersion, chapterId));
  };

  const isExpanded = expandedIndex === index;
  const chapters = isExpanded ? item.chapters : [];

  return (
    <Animated.View style={styles.expandable} layout={LinearTransition.build()}>
      <TouchableOpacity onPress={toggleExpand} style={styles.titleContainer}>
        <Text style={styles.title}>{item.bookName}</Text>
      </TouchableOpacity>
      <View style={styles.row}>
        {chapters.map((chapter) => (
          <Pressable
            key={chapter.chapterId}
            style={styles.square}
            onPress={() => goToChapterScreen(chapter.chapterId)}
          >
            <Text style={styles.content}>{chapter.chapterNo}</Text>
          </Pressable>
        ))}
      </View>
    </Animated.View>
  );
}

function BuildStyleSheet(theme: 'dark' | 'light') {
  const { width } = Dimensions.get('window');
  const responsiveWidth = (width - 86) / 6;
  return StyleSheet.create({
    expandable: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 12,
      backgroundColor: STYLES.COLORS[theme].BACKGROUND.PRIMARY,
    },
    titleContainer: {
      overflow: 'hidden',
    },
    title: {
      paddingVertical: 12,
      fontFamily: STYLES.FONT.REGULAR,
      fontSize: 21,
      color: STYLES.COLORS[theme].TEXT.PRIMARY,
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      gap: 12,
    },
    square: {
      backgroundColor: STYLES.COLORS[theme].BACKGROUND.SECONDARY,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      width: responsiveWidth,
      height: responsiveWidth,
    },
    content: {
      fontFamily: STYLES.FONT.REGULAR,
      fontSize: 14,
      color: STYLES.COLORS[theme].TEXT.PRIMARY,
    },
  });
}
