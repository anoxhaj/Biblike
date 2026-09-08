import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';

import Ionicons from '@react-native-vector-icons/ionicons/static';

import { STYLES } from '@/core/constants';
import { useColorSchemeDefault } from '@/core/hooks';
import * as vsr from '@/core/repositories/VSearchResults';
import { useCurrentVersion, useVersions } from '@/core/stores/configs';
import { formatVersesForCopy, urlBuilder } from '@/core/utils';

import CopyButton from './CopyButton';
import Verse from './Verse';

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
  const versions = useVersions();
  const versionAbbreviation = versions.find((v) => v.id === currentVersion)?.abbreviation;

  const handleVersePress = (chapterId: number, verseId: number) => {
    const url = urlBuilder.chapter(currentVersion, chapterId, verseId);
    router.push(url);
  };

  const handleCopy = async (item: vsr.VSearchResult) => {
    await Clipboard.setStringAsync(
      formatVersesForCopy({
        bookName: item.bookName,
        chapterNumber: item.chapterNumber,
        versionAbbreviation,
        verses: [{ number: item.verseNumber, text: item.text }],
      }),
    );
  };

  const renderItem = ({ item }: { item: vsr.VSearchResult }) => (
    <Pressable
      style={styles.itemContainer}
      onPress={() => handleVersePress(item.chapterId, item.verseId)}
    >
      <View style={styles.itemHeader}>
        <Text style={styles.itemTitle}>
          {item.bookName} {item.chapterNumber}:{item.verseNumber}
        </Text>

        <CopyButton onCopy={() => handleCopy(item)} accessibilityLabel="Copy verse" />
      </View>

      <Verse
        id={item.verseId}
        number={item.verseNumber}
        text={item.text}
        selected={false}
        onPress={() => {}}
        highlight={searchQuery}
        highlightStyle={styles.highlight}
      />
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
      margin: 30,
      borderLeftColor: STYLES.COLORS[theme].BACKGROUND.SECONDARY,
      borderLeftWidth: 3,
      borderStyle: 'solid',
    },

    itemHeader: {
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: 30,
      gap: 30,
    },

    itemTitle: {
      textAlign: 'center',
      fontFamily: STYLES.FONT.BOLD,
      fontSize: 21,
      color: STYLES.COLORS[theme].TEXT.PRIMARY,
      width: '90%',
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
