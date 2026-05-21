import { View, StyleSheet, Text, LayoutChangeEvent } from 'react-native';

import { STYLES } from '@/core/constants';
import { useColorSchemeDefault } from '@/core/hooks';

export default function Verse({
  id,
  number,
  text,
  onPress,
  selected = false,
  onLayout,
  onLongPress,
}: {
  id: number;
  number: number;
  text: string;
  onPress: any;
  selected: boolean;
  onLongPress?: (id: number) => void;
  onLayout?: (event: LayoutChangeEvent) => void;
}) {
  const theme = useColorSchemeDefault();
  const styles = BuildStyleSheet(theme);

  return (
    <>
      <View style={styles.itemContainer} key={id} onLayout={onLayout}>
        <Text>
          <View>
            <Text style={styles.superscript}>{number} &nbsp;&nbsp;&nbsp;</Text>
          </View>
          <Text
            onPress={() => onPress(id)}
            onLongPress={() => onLongPress?.(id)}
            style={StyleSheet.flatten([
              styles.itemText,
              {
                textDecorationLine: selected ? 'underline' : undefined,
              },
            ])}
          >
            {text}
          </Text>
        </Text>
      </View>
    </>
  );
}

function BuildStyleSheet(theme: 'dark' | 'light') {
  return StyleSheet.create({
    itemContainer: {
      marginHorizontal: 30,
      marginVertical: 12,
    },
    itemText: {
      fontFamily: STYLES.FONT.REGULAR,
      fontSize: 21,
      lineHeight: 33,
      color: STYLES.COLORS[theme].TEXT.PRIMARY,
    },
    superscript: {
      fontFamily: STYLES.FONT.REGULAR,
      fontSize: 13,
      color: STYLES.COLORS[theme].TEXT.SECONDARY,
    },
  });
}
