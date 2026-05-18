import { useRouter, Link } from 'expo-router';
import Entypo from "@react-native-vector-icons/entypo/static";
import { View, StyleSheet, Pressable, Text } from 'react-native';

import { urlBuilder } from '@/core/utils';
import { STYLES } from '@/core/constants';
import { useAnimatedMenu, useColorSchemeDefault } from '@/core/hooks';
import Animated, { SharedValue } from 'react-native-reanimated';

export default function ReferencesMenu({
  show,
  versionId,
  chapterId,
  bookId,
  bookName,
  chapterNumber,
}: {
  show: SharedValue<number>;
  versionId: number;
  chapterId: number;
  bookId: number;
  bookName: string;
  chapterNumber: number;
}) {
  const router = useRouter();
  const theme = useColorSchemeDefault();
  const styles = BuildStyleSheet(theme);
  const menuAnimatedStyle = useAnimatedMenu(show, 300);

  const goToChapterScreen = async (newChapterId: number) => {
    if (newChapterId > 0 && newChapterId <= 1189)
      router.replace(urlBuilder.chapter(versionId, newChapterId));
  };

  return (
    <Animated.View style={[styles.menu, menuAnimatedStyle]}>
      <View style={styles.borderContainer}>
        <View style={styles.referencesContainer}>
          <Pressable style={styles.linkContainer} onPress={() => goToChapterScreen(chapterId - 1)}>
            <Text>
              {chapterId == 1 ? (
                ''
              ) : (
                <Entypo name="chevron-left" size={21} color={STYLES.COLORS[theme].TEXT.PRIMARY} />
              )}
            </Text>
          </Pressable>
          <Link style={styles.mainLink} href={`references?bookId=${bookId}`}>
            {bookName + ' ' + chapterNumber}
          </Link>
          <Pressable style={styles.linkContainer} onPress={() => goToChapterScreen(chapterId + 1)}>
            <Text>
              {chapterId == 1189 ? (
                ''
              ) : (
                <Entypo name="chevron-right" size={21} color={STYLES.COLORS[theme].TEXT.PRIMARY} />
              )}
            </Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

function BuildStyleSheet(theme: 'dark' | 'light') {
  return StyleSheet.create({
    menu: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
    borderContainer: {
      paddingVertical: 12,
      paddingHorizontal: 12,
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      overflow: 'hidden',
    },
    referencesContainer: {
      backgroundColor: STYLES.COLORS[theme].BACKGROUND.SECONDARY,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 21,
      paddingHorizontal: 6,
      paddingVertical: 3,
      height: 40,
      flex: 1,
      elevation: 3,
    },
    mainLink: {
      fontSize: 18,
      color: STYLES.COLORS[theme].TEXT.PRIMARY,
      fontFamily: STYLES.FONT.BOLD,
    },
    linkContainer: {
      width: 40,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 6,
    },
  });
}
