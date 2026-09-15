import { memo } from 'react';

import { Pressable, StyleSheet, Text } from 'react-native';

import { STYLES } from '@/core/constants';

function BookChip({
  label,
  count,
  selected,
  onPress,
  theme,
}: {
  label: string;
  count: number;
  selected: boolean;
  loading?: boolean;
  onPress: () => void;
  theme: 'dark' | 'light';
}) {
  const styles = buildStyleSheet(theme);
  const colors = STYLES.COLORS[theme];

  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected ? styles.chipActive : styles.chipInactive]}
    >
      <Text style={[styles.label, selected ? styles.labelActive : styles.labelInactive]}>
        {label}
      </Text>

      <Text style={[styles.count, selected ? styles.countActive : styles.countInactive]}>
        {count}
      </Text>
    </Pressable>
  );
}

function buildStyleSheet(theme: 'dark' | 'light') {
  const colors = STYLES.COLORS[theme];

  return StyleSheet.create({
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 18,
      borderWidth: 1.5,
      marginRight: 6,
    },
    chipActive: {
      backgroundColor: colors.BACKGROUND.SECONDARY,
      borderColor: colors.BACKGROUND.SECONDARY,
    },
    chipInactive: {
      backgroundColor: 'transparent',
      borderColor: colors.BACKGROUND.SECONDARY,
    },
    label: {
      fontFamily: STYLES.FONT.REGULAR,
      fontSize: 16,
    },
    labelActive: {
      color: theme === 'dark' ? colors.TEXT.PRIMARY : colors.TEXT.SECONDARY,
    },
    labelInactive: {
      color: colors.TEXT.SECONDARY,
    },
    count: {
      fontFamily: STYLES.FONT.BOLD,
      fontSize: 14,
      minWidth: 16,
      textAlign: 'center',
    },
    countActive: {
      color: theme === 'dark' ? colors.TEXT.PRIMARY : colors.TEXT.SECONDARY,
    },
    countInactive: {
      color: colors.TEXT.SECONDARY,
    },
  });
}

export default memo(BookChip);
