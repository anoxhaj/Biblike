import { useState, useEffect, useCallback } from "react";
import {
  FlatList,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useSQLiteContext } from "expo-sqlite";

import Verse from "../_shared/Verse";

import * as AppSettings from "../../constants/AppSettings";
import * as Styles from "../../constants/Styles";
import * as vcr from "../../models/VCrossReferences";
import useColorScheme from "../../hooks/useColorScheme";

export default function CrossReferencesList() {
  const db = useSQLiteContext();
  const [crosses, setCrosses] = useState<vcr.VCrossReferences[] | null>(null);

  const fetchCrosses = useCallback(() => {
    async function fetch() {
      await db.withExclusiveTransactionAsync(async () => {
        setCrosses(
          await vcr.GetByVerseIdAsync(
            db,
            AppSettings.CONFIGS.VERSION.value,
            AppSettings.CONFIGS.VERSE.value
          )
        );
      });
    }
    fetch();
  }, [db]);

  useEffect(() => {
    fetchCrosses();
  }, []);

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

  const theme = useColorScheme();
  const styles = BuildStyleSheet(theme);

  return (
    <>
      {crosses ? (
        crosses.length > 0 ? (
          <FlatList<vcr.VCrossReferences>
            contentContainerStyle={{
              backgroundColor: Styles.Colors[theme].primaryBackground,
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
                color: Styles.Colors[theme].primaryText,
              }}
            >
              No Cross References For This Verse
            </Text>
          </View>
        )
      ) : (
        <View style={styles.loaderView}>
          <ActivityIndicator
            size="large"
            color={Styles.Colors[theme].primaryText}
            style={styles.loader}
          />
        </View>
      )}
    </>
  );
}

function BuildStyleSheet(theme: "dark" | "light") {
  return StyleSheet.create({
    referenceContainer: {
      marginLeft: 30,
      marginVertical: 30,
      borderLeftColor: Styles.Colors[theme].secondaryBackground,
      borderLeftWidth: 3,
      borderStyle: "solid",
    },
    referenceTitle: {
      textAlign: "center",
      fontFamily: Styles.Font.bold,
      fontSize: Styles.Font.size,
      color: Styles.Colors[theme].primaryText,
    },
    loaderView: {
      backgroundColor: Styles.Colors[theme].primaryBackground,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      width: "100%",
    },
    loader: {
      backgroundColor: Styles.Colors[theme].primaryBackground,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      width: "100%",
    },
  });
}
