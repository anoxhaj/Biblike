import { useState, useEffect, useCallback, useRef } from "react";
import { ScrollView, StyleSheet, Text, Animated } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useRouter } from "expo-router";

import ReferencesMenu from "./ReferencesMenu";
import Verse from "../_shared/Verse";

import * as Styles from "../../constants/Styles";
import * as AppSettings from "../../constants/AppSettings";
import * as Helper from "../../helpers/Helper";
import * as vcwv from "../../models/VChapterWithVerses";
import * as c from "../../models/Configs";
import useColorScheme from "../../hooks/useColorScheme";
import Loader from "../_shared/Loader";

export default function Reader({
  versionId,
  chapterId,
}: {
  versionId: number;
  chapterId: number;
}) {
  const db = useSQLiteContext();

  const [chapter, setChapter] = useState<vcwv.VChapterWithVerses>();

  const fetchChapter = useCallback(() => {
    async function fetch() {
      await db.withExclusiveTransactionAsync(async () => {
        setChapter(await vcwv.GetChapterByIdAsync(db, versionId, chapterId));
        let entity: c.Configs = {
          key: AppSettings.CONFIGS.CHAPTER.key,
          value: chapterId.toString(),
        };
        await c.UpdateAsync(db, entity);
      });
    }
    fetch();
  }, [db]);

  useEffect(() => {
    fetchChapter();
  }, []);

  const [showMenu, setShowMenu] = useState(true);
  const [selectedVerseId, setSelectedVerseId] = useState<number | null>(null);
  const scrollY = new Animated.Value(0);
  const slideAnim = new Animated.Value(100);

  function animate() {
    if (!selectedVerseId) {
      Animated.timing(slideAnim, {
        toValue: showMenu ? 0 : -100,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: showMenu ? 0 : -100,
        duration: 0,
        useNativeDriver: true,
      }).start();
    }
  }

  animate();

  useEffect(() => {
    animate();
  }, [showMenu]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
    }
  );

  const tolerance = 600;
  const toleranceBottom = 1;
  let scrollViewLayoutHeight = useRef(0);
  let scrollViewHeight = useRef(0);
  let lastScrollValue = useRef(0);
  let lastScrollDownStopValue = useRef(0);
  let lastScrollUpStopValue = useRef(0);

  scrollY.addListener(({ value }) => {
    if (
      value <
      scrollViewHeight.current -
        scrollViewLayoutHeight.current -
        toleranceBottom
    ) {
      if (
        value > tolerance &&
        lastScrollValue.current <= value &&
        lastScrollUpStopValue.current + tolerance <= value
      ) {
        lastScrollDownStopValue.current = value;
        setShowMenu(false);
        lastScrollValue.current = value;
        return;
      }

      if (
        lastScrollValue.current > value &&
        lastScrollDownStopValue.current - tolerance > value
      ) {
        lastScrollDownStopValue.current = value;
        lastScrollUpStopValue.current = value;
        setShowMenu(true);
        lastScrollValue.current = value;
        return;
      }
    } else {
      lastScrollValue.current = value;
      lastScrollDownStopValue.current = value;
      if (!showMenu) setShowMenu(true);
    }
  });

  const router = useRouter();

  const goToCrossReferencesScreen = async (verseId: number) => {
    if (selectedVerseId === verseId) {
      router.push(Helper.buildCrossReferencesUrl(versionId, verseId));
    } else {
      setSelectedVerseId(verseId);
    }
  };

  const renderItem = ({ item }: { item: vcwv.Verse }) => (
    <Verse
      key={item.id}
      id={item.id}
      number={item.number}
      text={item.text}
      selected={selectedVerseId === item.id}
      onPress={goToCrossReferencesScreen}
    ></Verse>
  );

  const theme = useColorScheme();
  const styles = BuildStyleSheet(theme);

  function setConfigs() {
    AppSettings.CONFIGS.BOOK.value = chapter?.bookId;
    return true;
  }

  return (
    <>
      {chapter && setConfigs() ? (
        <>
          <ScrollView
            overScrollMode="never"
            contentContainerStyle={{
              paddingTop: 60,
              paddingBottom: 60,
              backgroundColor: Styles.Colors[theme].primaryBackground,
            }}
            style={{
              position: "absolute",
              top: 0,
              width: "100%",
              height: "100%",
            }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            onLayout={(event: any) => {
              const { height } = event.nativeEvent.layout;
              if (scrollViewLayoutHeight.current < height)
                scrollViewLayoutHeight.current = height;
            }}
            onContentSizeChange={(w, h) => {
              if (scrollViewHeight.current < h) scrollViewHeight.current = h;
            }}
          >
            <Text style={styles.bookName}>{chapter?.bookName}</Text>
            <Text style={styles.chapterNumber}>{chapter?.chapterNumber}</Text>
            {chapter?.verses.map((item) => renderItem({ item }))}
            <Text style={styles.about}>~</Text>
          </ScrollView>

          {showMenu && (
            <Animated.View
              style={[styles.menu, { transform: [{ translateY: slideAnim }] }]}
            >
              <ReferencesMenu
                versionId={versionId}
                chapterId={chapterId}
                bookName={chapter?.bookName ?? ""}
                chapterNumber={chapter?.chapterNumber ?? 0}
              ></ReferencesMenu>
            </Animated.View>
          )}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
}

function BuildStyleSheet(theme: "dark" | "light") {
  return StyleSheet.create({
    bookName: {
      textAlign: "center",
      fontFamily: Styles.Font.bold,
      fontSize: Styles.Font.size,
      color: Styles.Colors[theme].primaryText,
    },
    chapterNumber: {
      textAlign: "center",
      fontFamily: Styles.Font.bold,
      fontSize: 66,
      color: Styles.Colors[theme].primaryText,
    },
    itemContainer: {
      marginHorizontal: 30,
      marginVertical: 12,
    },
    itemText: {
      fontFamily: Styles.Font.regular,
      fontSize: Styles.Font.size,
      lineHeight: 33,
      color: Styles.Colors[theme].primaryText,
    },
    superscript: {
      fontFamily: Styles.Font.regular,
      fontSize: 13,
      color: Styles.Colors[theme].primaryText,
    },
    about: {
      textAlign: "center",
      paddingTop: 120,
      paddingBottom: 30,
      fontFamily: Styles.Font.italic,
      fontSize: Styles.Font.size,
      color: Styles.Colors[theme].primaryText,
    },
    menu: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
    },
  });
}
