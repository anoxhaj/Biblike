import { ScrollView } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useState, useEffect, useCallback, useRef } from 'react';

import ReferencesItem from '@/core/components/ReferencesItem';
import Screen from '@/core/components/Screen';
import { STYLES } from '@/core/constants';
import { useColorSchemeDefault } from '@/core/hooks';
import { useCurrentVersion } from '@/core/stores/configs';
import * as vbwc from '@/core/repositories/VBookWithChapters';
import Loader from '@/core/components/Loader';

export default function ReferencesGrid({ bookId }: { bookId: number }) {
  const db = useSQLiteContext();
  const [books, setBooks] = useState<vbwc.VBookWithChapters[] | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number>(bookId - 1);
  const scrollViewRef = useRef<ScrollView>(null);
  const theme = useColorSchemeDefault();
  const currentVersion = useCurrentVersion();

  const fetchBooks = useCallback(() => {
    async function fetch() {
      await db.withExclusiveTransactionAsync(async () => {
        setBooks(await vbwc.GetAllByVersionAsync(db, currentVersion));
      });
    }
    fetch();
  }, [db, currentVersion]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const onExpansionHandler = (index: number) => {
    setExpandedIndex((prevIndex) => {
      if (prevIndex !== index) {
        scrollViewRef.current?.scrollTo({
          y: index * 76.4,
          animated: true,
        });
      }
      return prevIndex === index ? -1 : index;
    });
  };

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: (bookId - 1) * 76.4,
        animated: true,
      });
    }, 100);
  }, []);

  return (
    <Screen removeTopEdge={true}>
      {books ? (
        <ScrollView
          ref={scrollViewRef}
          style={{
            flex: 1,
            backgroundColor: STYLES.COLORS[theme].BACKGROUND.PRIMARY,
          }}
          overScrollMode="never"
          contentContainerStyle={{ paddingVertical: 0 }}
          showsVerticalScrollIndicator={false}
        >
          {books.map((item, index) => (
            <ReferencesItem
              key={index.toString()}
              index={index}
              item={item}
              expandedIndex={expandedIndex}
              onExpansion={onExpansionHandler}
            />
          ))}
        </ScrollView>
      ) : (
        <Loader />
      )}
    </Screen>
  );
}
