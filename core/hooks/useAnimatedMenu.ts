import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  useAnimatedReaction,
  SharedValue,
} from 'react-native-reanimated';

export function useAnimatedMenu(show: SharedValue<number>) {
  const translateY = useSharedValue(300);
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useAnimatedReaction(
    () => show.value,
    (visible, previous) => {
      if (visible === previous) return;

      if (visible === 1) {
        translateY.value = withSpring(0, {
          damping: 20,
          stiffness: 100,
          mass: 1,
        });

        scale.value = withDelay(
          50,
          withSpring(1, {
            damping: 15,
            stiffness: 120,
            mass: 0.8,
          }),
        );

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

        scale.value = withDelay(
          200,
          withSpring(0.8, {
            damping: 20,
            stiffness: 90,
            mass: 1,
          }),
        );

        translateY.value = withDelay(
          300,
          withSpring(300, {
            damping: 25,
            stiffness: 80,
            mass: 1.2,
          }),
        );
      }
    },
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }, { scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return animatedStyle;
}
