import { useState, useEffect, useCallback, useRef } from "react";
import { ScrollView, View } from "react-native";
import { useSQLiteContext } from "expo-sqlite";

import Item from "./ReferencesItem";

import * as AppSettings from "../../constants/AppSettings";
import * as Styles from "../../constants/Styles";
import * as vbwc from "../../models/VBookWithChapters";
import useColorScheme from "../../hooks/useColorScheme";

export default function ReferencesGrid() {
  const db = useSQLiteContext();
  const [books, setBooks] = useState<vbwc.VBookWithChapters[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number>(-1);
  const scrollViewRef = useRef<ScrollView>(null);
  const theme = useColorScheme();

  const fetchBooks = useCallback(() => {
    async function fetch() {
      await db.withExclusiveTransactionAsync(async () => {
        setBooks(
          await vbwc.GetAllByLanguageAsync(
            db,
            AppSettings.CONFIGS.LANGUAGE.value
          )
        );
      });
    }
    fetch();
  }, [db]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const onExpansionHandler = (index: number) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? -1 : index));
  };

  useEffect(() => {
    scrollViewRef.current?.scrollTo({
      y: (AppSettings.CONFIGS.BOOK.value - 1) * 76,
      animated: true,
    });
  }, []);

  return (
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
        <View key={index.toString()}>
          <Item
            index={index}
            item={item}
            expandedIndex={expandedIndex}
            onExpansion={onExpansionHandler}
          />
        </View>
      ))}
    </ScrollView>
  );
}
