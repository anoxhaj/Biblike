import { useState, useEffect, useCallback, useRef } from "react";
import { FlatList } from "react-native";
import { useSQLiteContext } from "expo-sqlite";

import Item from "./ReferencesItem";

import * as AppSettings from "../../constants/AppSettings";
import * as Styles from "../../constants/Styles";
import * as vbwc from "../../models/VBookWithChapters";
import useColorScheme from "../../hooks/useColorScheme";

export default function ReferencesGrid() {
  const db = useSQLiteContext();
  const [books, setBooks] = useState<vbwc.VBookWithChapters[]>([]);
  const flatListRef = useRef<FlatList<vbwc.VBookWithChapters>>(null);

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

  const [expandedIndex, setExpandedIndex] = useState<number>(-1);

  const onExpansionHandler = (index: number) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? -1 : index));

    if (flatListRef.current && expandedIndex != index) {
      flatListRef?.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0,
      });
    }
  };

  const theme = useColorScheme();

  const renderItem = ({
    item,
    index,
  }: {
    item: vbwc.VBookWithChapters;
    index: number;
  }) => (
    <Item
      index={index}
      item={item}
      expandedIndex={expandedIndex}
      onExpansion={onExpansionHandler}
    />
  );

  return (
    <FlatList<vbwc.VBookWithChapters>
      contentContainerStyle={{
        backgroundColor: Styles.Colors[theme].primaryBackground,
      }}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      data={books}
      renderItem={renderItem}
      overScrollMode="never"
      ref={flatListRef}
      keyExtractor={(item, index) => index.toString()}
      getItemLayout={(data, index) => {
        return {
          length: 76,
          offset: 76 * index,
          index,
        };
      }}
    />
  );
}
