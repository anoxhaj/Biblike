import { useCallback, useEffect, useRef, useState } from 'react';

import { Pressable, StyleSheet } from 'react-native';

import Ionicons from '@react-native-vector-icons/ionicons/static';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { STYLES } from '@/core/constants';
import { useColorSchemeDefault } from '@/core/hooks';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ICON_SIZE = 18;
const ANIMATION_DURATION = 180;
const DISPLAY_DURATION = 900;

const easingOut = Easing.out(Easing.quad);
const easingIn = Easing.in(Easing.quad);

export default function CopyButton({
  onCopy,
  accessibilityLabel = 'Copy',
}: {
  onCopy: () => Promise<void> | void;
  accessibilityLabel?: string;
}) {
  const theme = useColorSchemeDefault();

  const [copied, setCopied] = useState(false);
  const resetTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressId = useRef(0);

  const copyScale = useSharedValue(1);
  const copyOpacity = useSharedValue(1);

  const checkScale = useSharedValue(0.7);
  const checkOpacity = useSharedValue(0);

  const clearResetTimeout = useCallback(() => {
    if (resetTimeout.current) {
      clearTimeout(resetTimeout.current);
      resetTimeout.current = null;
    }
  }, []);

  const showCopied = useCallback(() => {
    setCopied(true);

    cancelAnimation(copyOpacity);
    cancelAnimation(copyScale);
    cancelAnimation(checkOpacity);
    cancelAnimation(checkScale);

    // Copy icon exits.
    copyOpacity.value = withTiming(0, {
      duration: ANIMATION_DURATION,
      easing: easingOut,
    });

    copyScale.value = withTiming(0.7, {
      duration: ANIMATION_DURATION,
      easing: easingOut,
    });

    // Check icon enters.
    checkOpacity.value = withTiming(1, {
      duration: ANIMATION_DURATION,
      easing: easingOut,
    });

    checkScale.value = withSequence(
      withTiming(1.08, {
        duration: ANIMATION_DURATION,
        easing: easingOut,
      }),
      withTiming(1, {
        duration: 100,
        easing: easingOut,
      }),
    );
  }, [checkOpacity, checkScale, copyOpacity, copyScale]);

  const hideCopied = useCallback(() => {
    setCopied(false);

    cancelAnimation(copyOpacity);
    cancelAnimation(copyScale);
    cancelAnimation(checkOpacity);
    cancelAnimation(checkScale);

    // Check icon exits.
    checkOpacity.value = withTiming(0, {
      duration: ANIMATION_DURATION,
      easing: easingIn,
    });

    checkScale.value = withTiming(0.7, {
      duration: ANIMATION_DURATION,
      easing: easingIn,
    });

    // Copy icon returns.
    copyOpacity.value = withTiming(1, {
      duration: ANIMATION_DURATION,
      easing: easingOut,
    });

    copyScale.value = withSequence(
      withTiming(1.08, {
        duration: ANIMATION_DURATION,
        easing: easingOut,
      }),
      withTiming(1, {
        duration: 100,
        easing: easingOut,
      }),
    );
  }, [checkOpacity, checkScale, copyOpacity, copyScale]);

  const handlePress = useCallback(async () => {
    clearResetTimeout();

    const currentPressId = ++pressId.current;

    await onCopy();

    // Ignore an older async operation if the user pressed again.
    if (currentPressId !== pressId.current) {
      return;
    }

    showCopied();

    resetTimeout.current = setTimeout(() => {
      resetTimeout.current = null;

      // Only reset if this is still the latest press.
      if (currentPressId === pressId.current) {
        hideCopied();
      }
    }, DISPLAY_DURATION);
  }, [clearResetTimeout, hideCopied, onCopy, showCopied]);

  useEffect(() => {
    return () => {
      clearResetTimeout();

      cancelAnimation(copyOpacity);
      cancelAnimation(copyScale);
      cancelAnimation(checkOpacity);
      cancelAnimation(checkScale);
    };
  }, [checkOpacity, checkScale, clearResetTimeout, copyOpacity, copyScale]);

  const copyAnimatedStyle = useAnimatedStyle(() => ({
    opacity: copyOpacity.value,
    transform: [{ scale: copyScale.value }],
  }));

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    opacity: checkOpacity.value,
    transform: [{ scale: checkScale.value }],
  }));

  const color = STYLES.COLORS[theme].TEXT.PRIMARY;

  return (
    <AnimatedPressable
      onPress={handlePress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={copied ? 'Copied' : accessibilityLabel}
      style={styles.button}
    >
      <Animated.View style={[styles.icon, copyAnimatedStyle]}>
        <Ionicons name="copy-outline" size={ICON_SIZE} color={color} />
      </Animated.View>

      <Animated.View style={[styles.icon, checkAnimatedStyle]}>
        <Ionicons name="checkmark" size={ICON_SIZE} color={color} />
      </Animated.View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    position: 'absolute',
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
