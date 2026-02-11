import { View, StyleSheet, Text, FlatList, Pressable } from "react-native";
import { useRouter } from "expo-router";

import { STYLES } from "@/core/constants";
import { useColorSchemeDefault } from "@/core/hooks";
import { urlBuilder } from "@/core/utils";
import { useCurrentVersion } from "@/core/stores/configs";
import * as vsr from "@/core/repositories/VSearchResults";

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

  const handleVersePress = (chapterId: number) => {
    const url = urlBuilder.chapter(currentVersion, chapterId);
    router.push(url);
  };

  const renderItem = ({ item }: { item: vsr.VSearchResult }) => (
    <Pressable
      key={item.id}
      style={styles.resultItem}
      onPress={() => handleVersePress(item.chapterId)}
    >
      <View style={styles.referenceContainer}>
        <Text style={styles.referenceText}>
          {item.bookName} {item.chapterNumber}:{item.verseNumber}
        </Text>
      </View>
      <HighlightText
        text={item.text}
        highlight={searchQuery}
        textStyle={styles.verseText}
        highlightStyle={styles.highlight}
      />
    </Pressable>
  );

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      renderItem={renderItem}
      data={results}
    />
  );
}

function normalize(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function extractFtsTokens(query: string): string[] {
  return query
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .map((t) => t.replace(/["*]/g, "")) // remove quotes & prefix operator
    .filter((t) => t.length > 0);
}

function HighlightText({
  text,
  highlight,
  highlightStyle,
  textStyle,
}: {
  text: string;
  highlight: string;
  highlightStyle: any;
  textStyle: any;
}) {
  const tokens = highlight.trim().split(/\s+/).filter(Boolean);

  if (!tokens.length) {
    return <Text style={textStyle}>{text}</Text>;
  }

  const normalizedText = normalize(text);
  const normalizedTokens = tokens.map(normalize);

  // Match ANY token
  const regex = new RegExp(`(${normalizedTokens.join("|")})`, "gi");

  const parts: { text: string; highlighted: boolean }[] = [];
  let lastIndex = 0;

  normalizedText.replace(regex, (match, _p1, offset) => {
    parts.push({
      text: text.slice(lastIndex, offset),
      highlighted: false,
    });

    parts.push({
      text: text.slice(offset, offset + match.length),
      highlighted: true,
    });

    lastIndex = offset + match.length;
    return match;
  });

  parts.push({
    text: text.slice(lastIndex),
    highlighted: false,
  });

  return (
    <Text style={textStyle}>
      {parts.map((part, index) =>
        part.highlighted ? (
          <Text key={index} style={highlightStyle}>
            {part.text}
          </Text>
        ) : (
          <Text key={index}>{part.text}</Text>
        ),
      )}
    </Text>
  );
}

function BuildStyleSheet(theme: "dark" | "light") {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: STYLES.COLORS[theme].BACKGROUND.PRIMARY,
    },
    contentContainer: {
      paddingTop: 20,
      paddingBottom: 40,
    },
    resultItem: {
      marginHorizontal: 20,
      marginVertical: 10,
      padding: 15,
      backgroundColor: STYLES.COLORS[theme].BACKGROUND.SECONDARY,
      borderRadius: 8,
    },
    referenceContainer: {
      marginBottom: 8,
    },
    referenceText: {
      fontFamily: STYLES.FONT.BOLD,
      fontSize: 16,
      color: STYLES.COLORS[theme].TEXT.PRIMARY,
    },
    verseText: {
      fontFamily: STYLES.FONT.REGULAR,
      fontSize: 18,
      lineHeight: 28,
      color: STYLES.COLORS[theme].TEXT.PRIMARY,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 100,
    },
    emptyText: {
      fontFamily: STYLES.FONT.ITALIC,
      fontSize: 18,
      color: STYLES.COLORS[theme].TEXT.SECONDARY,
    },
    highlight: {
      backgroundColor: "yellow", //STYLES.COLORS[theme].ACCENT,
      color: "#000", //STYLES.COLORS[theme].TEXT.ON_ACCENT,
      fontFamily: STYLES.FONT.BOLD,
    },
  });
}
