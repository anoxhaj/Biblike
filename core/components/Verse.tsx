import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';

import { STYLES } from '@/core/constants';
import { useColorSchemeDefault } from '@/core/hooks';

export default function Verse({
  id,
  number,
  text,
  onPress = (id) => {},
  selected = false,
  onLayout,
  onLongPress,
  highlight,
  highlightStyle,
}: {
  id: number;
  number: number;
  text: string;
  onPress?: (id: number) => void;
  selected?: boolean;
  onLongPress?: (id: number) => void;
  onLayout?: (event: LayoutChangeEvent) => void;
  highlight?: string;
  highlightStyle?: any;
}) {
  const theme = useColorSchemeDefault();
  const styles = BuildStyleSheet(theme);

  const tokens = highlight?.trim().split(/\s+/).filter(Boolean) ?? [];

  let parts: { text: string; highlighted: boolean }[] = [];

  if (!tokens.length) {
    parts = [{ text, highlighted: false }];
  } else {
    const normalizedText = normalize(text);
    const normalizedTokens = tokens.map(normalize);

    const regex = new RegExp(`(${normalizedTokens.join('|')})`, 'gi');

    let lastIndex = 0;

    normalizedText.replace(regex, (match, _p1, offset) => {
      parts.push({
        text: text.slice(lastIndex, offset),
        highlighted: false,
      });

      parts.push({
        text: text.slice(offset, offset + match.length),
        highlighted: true,
      });

      lastIndex = offset + match.length;

      return match;
    });

    parts.push({
      text: text.slice(lastIndex),
      highlighted: false,
    });
  }

  return (
    <View style={styles.itemContainer} onLayout={onLayout}>
      <Text>
        <Text style={styles.superscript}>
          {number} {'   '}
        </Text>

        <Text
          onPress={() => onPress(id)}
          onLongPress={() => onLongPress?.(id)}
          style={[
            styles.itemText,
            {
              textDecorationLine: selected ? 'underline' : undefined,
            },
          ]}
        >
          {parts.map((part, index) =>
            part.highlighted ? (
              <Text key={index} style={[styles.itemText, styles.highlightText, highlightStyle]}>
                {part.text}
              </Text>
            ) : (
              <Text key={index}>{part.text}</Text>
            ),
          )}
        </Text>
      </Text>
    </View>
  );
}

function normalize(str: string) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
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

    highlightText: {
      backgroundColor: '#FFE066',
      color: '#000',
    },
  });
}
