import { useState, useEffect, useCallback } from "react";
import { FlatList, Text, View, StyleSheet } from "react-native";
import { useSQLiteContext } from "expo-sqlite";

import Verse from "@/core/components/Verse";
import Loader from "@/core/components/Loader";
import Screen from "@/core/components/Screen";
import { STYLES } from "@/core/constants";
import { useColorSchemeDefault } from "@/core/hooks";
import { useCurrentVersion } from "@/core/stores/configs";
import * as vcr from "@/core/repositories/VCrossReferences";

export default function CrossReferencesList({ verseId }: { verseId: number }) {
  const db = useSQLiteContext();
  const [crosses, setCrosses] = useState<vcr.VCrossReferences[] | null>(null);
  const currentVersion = useCurrentVersion();

  const fetchCrosses = useCallback(() => {
    async function fetch() {
      await db.withExclusiveTransactionAsync(async () => {
        setCrosses(await vcr.GetByVerseIdAsync(db, currentVersion, verseId));
      });
    }
    fetch();
  }, [db, currentVersion, verseId]);

  useEffect(() => {
    fetchCrosses();
  }, [fetchCrosses]);

  const renderItem = ({ item }: { item: vcr.VCrossReferences }) => (
    <View key={item.id} style={styles.referenceContainer}>
      <View>
        <Text style={styles.referenceTitle}>{`${item.bookName} ${
          item.chapterNumber
        }:${
          item.verseNumberFrom === item.verseNumberTo
            ? item.verseNumberFrom
            : `${item.verseNumberFrom}-${item.verseNumberTo}`
        } (v: ${item.votes})`}</Text>
      </View>
      {item.verses.map((verse: vcr.Verse, index: number) => (
        <Verse
          key={index}
          id={verse.verseId}
          number={verse.verseNumber}
          text={verse.verseText}
          selected={false}
          onPress={() => {}}
        ></Verse>
      ))}
    </View>
  );

  const theme = useColorSchemeDefault();
  const styles = BuildStyleSheet(theme);

  return (
    <Screen removeTopEdge={true}>
      {crosses ? (
        crosses.length > 0 ? (
          <FlatList<vcr.VCrossReferences>
            contentContainerStyle={{
              backgroundColor: STYLES.COLORS[theme].BACKGROUND.PRIMARY,
            }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={crosses}
            renderItem={renderItem}
            overScrollMode="never"
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <View style={styles.loaderView}>
            <Text
              style={{
                color: STYLES.COLORS[theme].TEXT.PRIMARY,
              }}
            >
              No Cross References For This Verse
            </Text>
          </View>
        )
      ) : (
        <Loader />
      )}
    </Screen>
  );
}

function BuildStyleSheet(theme: "dark" | "light") {
  return StyleSheet.create({
    referenceContainer: {
      marginLeft: 30,
      marginVertical: 30,
      borderLeftColor: STYLES.COLORS[theme].BACKGROUND.SECONDARY,
      borderLeftWidth: 3,
      borderStyle: "solid",
    },
    referenceTitle: {
      textAlign: "center",
      fontFamily: STYLES.FONT.BOLD,
      fontSize: 21,
      color: STYLES.COLORS[theme].TEXT.PRIMARY,
    },
    loaderView: {
      backgroundColor: STYLES.COLORS[theme].BACKGROUND.PRIMARY,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      width: "100%",
    },
  });
}
