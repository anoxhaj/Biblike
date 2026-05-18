import Animated, { SharedValue } from 'react-native-reanimated';
import { Pressable, StyleSheet, View } from 'react-native';

import { STYLES } from '@/core/constants';
import { useRouter } from 'expo-router';
import { useColorSchemeDefault } from '@/core/hooks/useColorScheme';
import { useAnimatedMenu } from '@/core/hooks/useAnimatedMenu';
import React from 'react';
import VersionsPicker from './VersionsPicker';
import Ionicons from '@react-native-vector-icons/ionicons/static';
import { urlBuilder } from '@/core/utils';

export default function TopMenu({
  show,
  chapterId,
}: {
  show: SharedValue<number>;
  chapterId: number;
}) {
  const router = useRouter();
  const theme = useColorSchemeDefault();
  const styles = BuildStyleSheet(theme);
  const menuAnimatedStyle = useAnimatedMenu(show, -300);

  const goToSearchScreen = () => {
    router.push(urlBuilder.search());
  };

  return (
    <Animated.View style={[styles.menu, menuAnimatedStyle]}>
      <View style={styles.borderContainer}>
        <Pressable style={styles.searchButton} onPress={goToSearchScreen}>
          <Ionicons name="search" size={21} color={STYLES.COLORS[theme].TEXT.PRIMARY} />
        </Pressable>
        <VersionsPicker chapterId={chapterId} />
      </View>
    </Animated.View>
  );
}

function BuildStyleSheet(theme: 'dark' | 'light') {
  return StyleSheet.create({
    menu: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1,
    },
    borderContainer: {
      paddingVertical: 12,
      paddingHorizontal: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      overflow: 'hidden',
    },
    searchButton: {
      width: 50,
      height: 40,
      backgroundColor: STYLES.COLORS[theme].BACKGROUND.SECONDARY,
      borderRadius: 21,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 3,
    },
  });
}
