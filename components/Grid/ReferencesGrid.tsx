import { ScrollView } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useState, useEffect, useCallback, useRef } from "react";
import Animated, { LinearTransition } from "react-native-reanimated";

import Item from "./ReferencesItem";
import Screen from "../_shared/Screen";
import * as Styles from "@/constants/Styles";
import useColorScheme from "@/hooks/useColorScheme";
import { useCurrentVersion } from "@/constants/store";
import * as vbwc from "@/repositories/VBookWithChapters";

export default function ReferencesGrid({ bookId }: { bookId: number }) {
  const db = useSQLiteContext();
  const [books, setBooks] = useState<vbwc.VBookWithChapters[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number>(bookId - 1);
  const scrollViewRef = useRef<ScrollView>(null);
  const theme = useColorScheme();
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
      <ScrollView
        ref={scrollViewRef}
        style={{
          flex: 1,
          backgroundColor: Styles.Colors[theme].primaryBackground,
        }}
        overScrollMode="never"
        contentContainerStyle={{ paddingVertical: 0 }}
        showsVerticalScrollIndicator={false}
      >
        {books.map((item, index) => (
          <Animated.View
            key={index.toString()}
            layout={LinearTransition.springify()}
          >
            <Item
              index={index}
              item={item}
              expandedIndex={expandedIndex}
              onExpansion={onExpansionHandler}
            />
          </Animated.View>
        ))}
      </ScrollView>
    </Screen>
  );
}
