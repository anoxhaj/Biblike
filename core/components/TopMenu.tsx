import Animated, { SharedValue } from 'react-native-reanimated';
import { StyleSheet } from 'react-native';

import { STYLES } from '@/core/constants';
import { useRouter } from 'expo-router';
import { useColorSchemeDefault } from '../hooks/useColorScheme';
import { useAnimatedMenu } from '../hooks/useAnimatedMenu';

export default function TopMenu({ show }: { show: SharedValue<number> }) {
  const router = useRouter();
  const theme = useColorSchemeDefault();
  const styles = BuildStyleSheet(theme);
  const menuAnimatedStyle = useAnimatedMenu(show);

  <Animated.View style={[styles.menu, menuAnimatedStyle]}></Animated.View>;
}

function BuildStyleSheet(theme: 'dark' | 'light') {
  return StyleSheet.create({
    menu: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 70,
      backgroundColor: 'red',
    },
  });
}
