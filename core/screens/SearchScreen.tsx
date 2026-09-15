import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { StyleSheet, Text, TextInput, View } from 'react-native';

import { useSQLiteContext } from 'expo-sqlite';

import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import BookFilterBar, { BookSection } from '@/core/components/BookFilterBar';
import Loader from '@/core/components/Loader';
import Screen from '@/core/components/Screen';
import SearchResults from '@/core/components/SearchResults';
import { STYLES } from '@/core/constants';
import { useColorSchemeDefault } from '@/core/hooks';
import * as vsr from '@/core/repositories/VSearchResults';
import { useCurrentVersion } from '@/core/stores/configs';

type ScreenState = 'idle' | 'loading' | 'results' | 'empty';

export default function SearchScreen() {
  const db = useSQLiteContext();
  const theme = useColorSchemeDefault();
  const styles = BuildStyleSheet(theme);
  const currentVersion = useCurrentVersion();

  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<vsr.VSearchResult[]>([]);
  const [screenState, setScreenState] = useState<ScreenState>('idle');

  const searchRequestId = useRef(0);

  const performSearch = useCallback(
    async (query: string) => {
      const trimmedQuery = query.trim();

      const requestId = ++searchRequestId.current;

      if (!trimmedQuery) {
        setResults([]);
        setScreenState('idle');
        return;
      }

      setScreenState('loading');

      try {
        const searchResults = await vsr.SearchVersesByTextAsync(db, currentVersion, trimmedQuery);

        if (requestId !== searchRequestId.current) return;

        setResults(searchResults);
        setScreenState(searchResults.length > 0 ? 'results' : 'empty');
      } catch (error) {
        if (requestId !== searchRequestId.current) return;

        console.error('Search error:', error);
        setResults([]);
        setScreenState('empty');
      }
    },
    [db, currentVersion],
  );

  useEffect(() => {
    const query = searchQuery.trim();

    if (!query) {
      searchRequestId.current++;

      setResults([]);
      setScreenState('idle');
      return;
    }

    const timer = setTimeout(() => {
      performSearch(query);
    }, 700);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery, performSearch]);

  const bookSections = useMemo<BookSection[]>(() => {
    const seen = new Map<number, BookSection>();
    results.forEach((item, index) => {
      if (!seen.has(item.bookId)) {
        seen.set(item.bookId, {
          bookId: item.bookId,
          bookName: item.bookName,
          count: 0,
          firstIndex: index,
        });
      }
      seen.get(item.bookId)!.count += 1;
    });
    return Array.from(seen.values());
  }, [results]);

  const barVisible = screenState === 'results' && bookSections.length >= 2;

  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [visualSelectedBookId, setVisualSelectedBookId] = useState<number | null>(null);
  const [loadingBookId, setLoadingBookId] = useState<number | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [pendingBookId, setPendingBookId] = useState<number | null | undefined>(undefined);

  const prevResultsLength = useRef<number>(0);
  useEffect(() => {
    if (results.length !== prevResultsLength.current) {
      prevResultsLength.current = results.length;
      setSelectedBookId(null);
      setVisualSelectedBookId(null);
      setLoadingBookId(null);
      setIsFiltering(false);
      setPendingBookId(undefined);
    }
  }, [results.length]);

  const handleToggle = useCallback((bookId: number) => {
    setLoadingBookId(bookId);
    setIsFiltering(true);
    setPendingBookId(bookId);
  }, []);

  const handleClearAll = useCallback(() => {
    setLoadingBookId(-1);
    setIsFiltering(true);
    setPendingBookId(null);
  }, []);

  useEffect(() => {
    if (pendingBookId !== undefined) {
      startTransition(() => {
        setSelectedBookId(pendingBookId);
      });
    }
  }, [pendingBookId]);

  const prevSelectedBookId = useRef<number | null>(null);
  useEffect(() => {
    if (prevSelectedBookId.current !== selectedBookId) {
      if (prevSelectedBookId.current !== null || selectedBookId !== null) {
        setScrollToTop((prev) => prev + 1);

        setLoadingBookId(null);
        setIsFiltering(false);
        setPendingBookId(undefined);
        setVisualSelectedBookId(selectedBookId);
      }
    }
    prevSelectedBookId.current = selectedBookId;
  }, [selectedBookId]);

  const [scrollToTop, setScrollToTop] = useState(0);

  const displayedResults = useMemo(() => {
    if (selectedBookId === null) return results;
    return results.filter((item) => item.bookId === selectedBookId);
  }, [results, selectedBookId]);

  const selectedBookIds = useMemo(
    () => (visualSelectedBookId === null ? new Set<number>() : new Set([visualSelectedBookId])),
    [visualSelectedBookId],
  );

  return (
    <Screen removeTopEdge>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search in verses..."
          placeholderTextColor={STYLES.COLORS[theme].TEXT.SECONDARY}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
      </View>

      <BookFilterBar
        books={bookSections}
        selectedBookIds={selectedBookIds}
        onToggle={handleToggle}
        onClearAll={handleClearAll}
        visible={barVisible}
        loadingBookId={loadingBookId}
        theme={theme}
      />

      <View style={{ flex: 1, position: 'relative' }}>
        {screenState === 'idle' && (
          <Animated.View
            key="instruction"
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
            style={styles.instructionContainer}
          >
            <Text style={styles.instructionText}>
              Enter a word or phrase to search through the verses
            </Text>
          </Animated.View>
        )}

        {screenState === 'loading' && (
          <Animated.View
            key="loading"
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
            style={StyleSheet.absoluteFill}
          >
            <Loader />
          </Animated.View>
        )}

        {isFiltering && screenState === 'results' && (
          <Animated.View
            key="filtering"
            entering={FadeIn.duration(100)}
            exiting={FadeOut.duration(150)}
            style={StyleSheet.absoluteFill}
          >
            <Loader />
          </Animated.View>
        )}

        {(screenState === 'results' || screenState === 'empty') && (
          <Animated.View
            key="results"
            entering={FadeIn.duration(200)}
            style={StyleSheet.absoluteFill}
          >
            <SearchResults
              filterKey={selectedBookId}
              results={displayedResults}
              searchQuery={searchQuery}
              scrollToTop={scrollToTop}
            />
          </Animated.View>
        )}
      </View>
    </Screen>
  );
}

function BuildStyleSheet(theme: 'dark' | 'light') {
  return StyleSheet.create({
    searchContainer: {
      paddingHorizontal: 30,
      paddingTop: 20,
      paddingBottom: 10,
    },
    searchInput: {
      fontFamily: STYLES.FONT.REGULAR,
      fontSize: 18,
      color: STYLES.COLORS[theme].TEXT.PRIMARY,
      borderBottomColor: STYLES.COLORS[theme].BACKGROUND.SECONDARY,
      borderBottomWidth: 3,
    },
    instructionContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    instructionText: {
      fontFamily: STYLES.FONT.ITALIC,
      fontSize: 18,
      textAlign: 'center',
      color: STYLES.COLORS[theme].TEXT.PRIMARY,
      lineHeight: 28,
    },
  });
}
