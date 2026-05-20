import { View, StyleSheet, Text, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import { STYLES } from '@/core/constants';
import { useColorSchemeDefault } from '@/core/hooks';
import { urlBuilder } from '@/core/utils';
import { useCurrentVersion } from '@/core/stores/configs';
import * as vsr from '@/core/repositories/VSearchResults';

export default function SearchResults({
  results,
  searchQuery,
}: {
  results: vsr.VSearchResult[];
  searchQuery: string;
}) {
  const theme = useColorSchemeDefault();
  const styles = BuildStyleSheet(theme);

  const router = useRouter();
  const currentVersion = useCurrentVersion();

  const handleVersePress = (chapterId: number) => {
    const url = urlBuilder.chapter(currentVersion, chapterId);
    router.push(url);
  };

  const renderItem = ({ item }: { item: vsr.VSearchResult }) => (
    <Pressable style={styles.itemContainer} onPress={() => handleVersePress(item.chapterId)}>
      <Text style={styles.itemTitle}>
        {item.bookName} {item.chapterNumber}:{item.verseNumber}
      </Text>

      <View style={styles.verseContainer}>
        <HighlightText
          text={item.text}
          highlight={searchQuery}
          textStyle={styles.verseText}
          highlightStyle={styles.highlight}
        />
      </View>
    </Pressable>
  );

  return results.length > 0 ? (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      data={results}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
    />
  ) : (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No matches were found</Text>
    </View>
  );
}

function normalize(str: string) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function HighlightText({
  text,
  highlight,
  highlightStyle,
  textStyle,
}: {
  text: string;
  highlight: string;
  highlightStyle: any;
  textStyle: any;
}) {
  const tokens = highlight.trim().split(/\s+/).filter(Boolean);

  if (!tokens.length) {
    return <Text style={textStyle}>{text}</Text>;
  }

  const normalizedText = normalize(text);
  const normalizedTokens = tokens.map(normalize);

  const regex = new RegExp(`(${normalizedTokens.join('|')})`, 'gi');

  const parts: { text: string; highlighted: boolean }[] = [];

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

  return (
    <Text style={textStyle}>
      {parts.map((part, index) =>
        part.highlighted ? (
          <Text key={index} style={highlightStyle}>
            {part.text}
          </Text>
        ) : (
          <Text key={index}>{part.text}</Text>
        ),
      )}
    </Text>
  );
}

function BuildStyleSheet(theme: 'dark' | 'light') {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: STYLES.COLORS[theme].BACKGROUND.PRIMARY,
    },
    contentContainer: {
      paddingTop: 10,
      paddingBottom: 40,
    },
    itemContainer: {
      marginLeft: 30,
      marginRight: 20,
      marginVertical: 30,
      borderLeftColor: STYLES.COLORS[theme].BACKGROUND.SECONDARY,
      borderLeftWidth: 3,
      paddingLeft: 20,
    },
    itemTitle: {
      textAlign: 'center',
      fontFamily: STYLES.FONT.BOLD,
      fontSize: 21,
      color: STYLES.COLORS[theme].TEXT.PRIMARY,
      marginBottom: 21,
    },
    verseContainer: {
      paddingRight: 10,
    },
    verseText: {
      fontFamily: STYLES.FONT.REGULAR,
      fontSize: 19,
      lineHeight: 33,
      color: STYLES.COLORS[theme].TEXT.PRIMARY,
    },
    highlight: {
      backgroundColor: theme === 'dark' ? 'rgba(255,255,0,0.35)' : 'rgba(255,255,0,0.6)',
      color: STYLES.COLORS[theme].TEXT.PRIMARY,
      fontFamily: STYLES.FONT.BOLD,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
      backgroundColor: STYLES.COLORS[theme].BACKGROUND.PRIMARY,
    },
    emptyText: {
      fontFamily: STYLES.FONT.ITALIC,
      fontSize: 18,
      textAlign: 'center',
      lineHeight: 28,
      color: STYLES.COLORS[theme].TEXT.PRIMARY,
    },
  });
}
