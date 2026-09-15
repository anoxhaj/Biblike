import { memo, useCallback, useEffect, useRef } from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';

import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';

import { FlashList, FlashListRef } from '@shopify/flash-list';

import { STYLES } from '@/core/constants';
import { useColorSchemeDefault } from '@/core/hooks';
import * as vsr from '@/core/repositories/VSearchResults';
import { useCurrentVersion, useVersions } from '@/core/stores/configs';
import { formatVersesForCopy, urlBuilder } from '@/core/utils';

import CopyButton from './CopyButton';
import Verse from './Verse';

const SearchResultItem = memo(
  ({
    item,
    searchQuery,
    theme,
    onPress,
    onCopy,
  }: {
    item: vsr.VSearchResult;
    searchQuery: string;
    theme: 'dark' | 'light';
    onPress: (chapterId: number, verseId: number) => void;
    onCopy: (item: vsr.VSearchResult) => void;
  }) => {
    const styles = BuildStyleSheet(theme);

    return (
      <Pressable style={styles.itemContainer} onPress={() => onPress(item.chapterId, item.verseId)}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemTitle}>
            {item.bookName} {item.chapterNumber}:{item.verseNumber}
          </Text>

          <CopyButton onCopy={() => onCopy(item)} accessibilityLabel="Copy verse" />
        </View>

        <Verse
          id={item.verseId}
          number={item.verseNumber}
          text={item.text}
          selected={false}
          onPress={() => onPress(item.chapterId, item.verseId)}
          highlight={searchQuery}
          highlightStyle={styles.highlight}
        />
      </Pressable>
    );
  },
);

export default function SearchResults({
  results,
  searchQuery,
  scrollToTop = 0,
  onScrollComplete,
  filterKey,
}: {
  results: vsr.VSearchResult[];
  searchQuery: string;
  scrollToTop?: number;
  onScrollComplete?: () => void;
  filterKey?: string | number | null;
}) {
  const theme = useColorSchemeDefault();
  const styles = BuildStyleSheet(theme);

  const flatListRef = useRef<FlashListRef<vsr.VSearchResult>>(null);

  const router = useRouter();
  const currentVersion = useCurrentVersion();
  const versions = useVersions();
  const versionAbbreviation = versions.find((v) => v.id === currentVersion)?.abbreviation;

  useEffect(() => {
    if (scrollToTop > 0 && flatListRef.current && results.length > 0) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: false });
      onScrollComplete?.();
    }
  }, [scrollToTop, results.length, onScrollComplete]);

  const handleVersePress = useCallback(
    (chapterId: number, verseId: number) => {
      const url = urlBuilder.chapter(currentVersion, chapterId, verseId);
      router.push(url);
    },
    [currentVersion, router],
  );

  const handleCopy = useCallback(
    async (item: vsr.VSearchResult) => {
      await Clipboard.setStringAsync(
        formatVersesForCopy({
          bookName: item.bookName,
          chapterNumber: item.chapterNumber,
          versionAbbreviation,
          verses: [{ number: item.verseNumber, text: item.text }],
        }),
      );
    },
    [versionAbbreviation],
  );

  const renderItem = useCallback(
    ({ item }: { item: vsr.VSearchResult }) => (
      <SearchResultItem
        item={item}
        searchQuery={searchQuery}
        theme={theme}
        onPress={handleVersePress}
        onCopy={handleCopy}
      />
    ),
    [searchQuery, theme, handleVersePress, handleCopy],
  );

  const keyExtractor = useCallback((item: vsr.VSearchResult) => item.id.toString(), []);

  return results.length > 0 ? (
    <FlashList
      key={filterKey ?? 'all'}
      ref={flatListRef}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      data={results}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  ) : (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No matches were found</Text>
    </View>
  );
}

function BuildStyleSheet(theme: 'dark' | 'light') {
  return StyleSheet.create({
    contentContainer: {
      paddingTop: 10,
      paddingBottom: 40,
      backgroundColor: STYLES.COLORS[theme].BACKGROUND.PRIMARY,
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
