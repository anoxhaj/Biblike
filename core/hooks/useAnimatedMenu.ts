import { useRef } from 'react';

import {
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';

export function useAnimatedMenu(show: SharedValue<number>, offset: number) {
  const firstRender = useRef(true);
  const direction = offset >= 0 ? 1 : -1;

  const translateY = useSharedValue(Math.abs(offset));
  const opacity = useSharedValue(0);

  useAnimatedReaction(
    () => show.value,
    (visible, previous) => {
      if (visible === previous) return;

      // initial sync only once
      if (firstRender.current) {
        translateY.value = visible === 1 ? 0 : Math.abs(offset);
        opacity.value = visible === 1 ? 1 : 0;

        firstRender.current = false;
        return;
      }

      if (visible === 1) {
        translateY.value = withSpring(0, {
          damping: 20,
          stiffness: 100,
          mass: 1,
        });

        opacity.value = withDelay(
          100,
          withSpring(1, {
            damping: 20,
            stiffness: 100,
            mass: 1,
          }),
        );
      } else {
        opacity.value = withDelay(
          100,
          withSpring(0, {
            damping: 25,
            stiffness: 80,
            mass: 1.2,
          }),
        );

        translateY.value = withDelay(
          300,
          withSpring(Math.abs(offset), {
            damping: 25,
            stiffness: 80,
            mass: 1.2,
          }),
        );
      }
    },
  );

  return useAnimatedStyle(() => ({
    transform: [{ translateY: direction * translateY.value }],
    opacity: opacity.value,
  }));
}
