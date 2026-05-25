import { useCallback, useEffect, useState } from 'react';

import { StyleSheet, Text, TextInput, View } from 'react-native';

import { useSQLiteContext } from 'expo-sqlite';

import Loader from '@/core/components/Loader';
import Screen from '@/core/components/Screen';
import SearchResults from '@/core/components/SearchResults';
import { STYLES } from '@/core/constants';
import { useColorSchemeDefault } from '@/core/hooks';
import * as vsr from '@/core/repositories/VSearchResults';
import { useCurrentVersion } from '@/core/stores/configs';

export default function SearchScreen() {
  const db = useSQLiteContext();
  const theme = useColorSchemeDefault();
  const styles = BuildStyleSheet(theme);
  const currentVersion = useCurrentVersion();

  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<vsr.VSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setResults([]);
        setHasSearched(false);
        return;
      }

      setIsLoading(true);
      setHasSearched(true);

      try {
        await db.withExclusiveTransactionAsync(async () => {
          const searchResults = await vsr.SearchVersesByTextAsync(db, currentVersion, query.trim());
          setResults(searchResults);
        });
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [db, currentVersion],
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      performSearch(searchQuery);
    }, 700);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, performSearch]);

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

      {isLoading ? (
        <Loader />
      ) : hasSearched ? (
        <SearchResults results={results} searchQuery={searchQuery} />
      ) : (
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>
            Enter a word or phrase to search through the verses
          </Text>
        </View>
      )}
    </Screen>
  );
}

function BuildStyleSheet(theme: 'dark' | 'light') {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: STYLES.COLORS[theme].BACKGROUND.PRIMARY,
    },
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
