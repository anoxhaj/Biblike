import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  withSpring,
  withDelay,
  runOnJS,
  interpolate,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { StyleSheet, Text } from "react-native";
import { useState, useEffect, useCallback } from "react";

import Verse from "../_shared/Verse";
import Loader from "../_shared/Loader";
import Screen from "../_shared/Screen";
import * as Helper from "@/helpers/Helper";
import * as Styles from "@/constants/Styles";
import ReferencesMenu from "./ReferencesMenu";
import useColorScheme from "@/hooks/useColorScheme";
import { useUpdateConfig } from "@/constants/store";
import * as vcwv from "@/repositories/VChapterWithVerses";

export default function Reader({
  versionId,
  chapterId,
}: {
  versionId: number;
  chapterId: number;
}) {
  const db = useSQLiteContext();

  const [chapter, setChapter] = useState<vcwv.VChapterWithVerses>();

  const updateConfig = useUpdateConfig();

  const fetchChapter = useCallback(() => {
    async function fetch() {
      await db.withExclusiveTransactionAsync(async () => {
        setChapter(await vcwv.GetChapterByIdAsync(db, versionId, chapterId));
        await updateConfig("CHAPTER", chapterId, db);
      });
    }
    fetch();
  }, [db, versionId, chapterId, updateConfig]);

  useEffect(() => {
    fetchChapter();
  }, [fetchChapter]);

  const [showMenu, setShowMenu] = useState(false);

  const [selectedVerseId, setSelectedVerseId] = useState<number | null>(null);

  useEffect(() => {
    animateMenu(showMenu);
  }, [showMenu]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMenu(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const scrollY = useSharedValue(0);
  const menuTranslateY = useSharedValue(300);
  const menuScale = useSharedValue(0.8);
  const menuOpacity = useSharedValue(0);
  const menuShadowOpacity = useSharedValue(0);
  const lastScrollValue = useSharedValue(0);
  const lastScrollDownStopValue = useSharedValue(0);
  const lastScrollUpStopValue = useSharedValue(0);
  const scrollViewHeight = useSharedValue(0);
  const scrollViewLayoutHeight = useSharedValue(0);
  const prevScrollY = useSharedValue(0);

  const tolerance = 600;
  const bottomTolerance = 300;
  const scrollUpTolerance = 300;

  useEffect(() => {
    prevScrollY.value = 0;
  }, []);

  const animateMenu = (show: boolean) => {
    if (show) {
      menuTranslateY.value = withSpring(0, {
        damping: 20,
        stiffness: 100,
        mass: 1,
      });
      menuScale.value = withDelay(
        50,
        withSpring(1, {
          damping: 15,
          stiffness: 120,
          mass: 0.8,
        })
      );
      menuOpacity.value = withDelay(
        100,
        withSpring(1, {
          damping: 20,
          stiffness: 100,
          mass: 1,
        })
      );
      menuShadowOpacity.value = withDelay(
        150,
        withSpring(0.3, {
          damping: 20,
          stiffness: 100,
          mass: 1,
        })
      );
    } else {
      menuShadowOpacity.value = withSpring(0, {
        damping: 25,
        stiffness: 80,
        mass: 1.2,
      });
      menuOpacity.value = withDelay(
        100,
        withSpring(0, {
          damping: 25,
          stiffness: 80,
          mass: 1.2,
        })
      );
      menuScale.value = withDelay(
        200,
        withSpring(0.8, {
          damping: 20,
          stiffness: 90,
          mass: 1,
        })
      );
      menuTranslateY.value = withDelay(
        300,
        withSpring(300, {
          damping: 25,
          stiffness: 80,
          mass: 1.2,
        })
      );
    }
  };

  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentY = event.contentOffset.y;
      const isScrollingDown = currentY > prevScrollY.value + 1;
      const isScrollingUp = currentY < prevScrollY.value - 1;

      prevScrollY.value = scrollY.value;
      scrollY.value = currentY;

      const isNearBottom =
        scrollY.value >=
        scrollViewHeight.value - scrollViewLayoutHeight.value - bottomTolerance;

      if (!isNearBottom) {
        if (
          isScrollingDown &&
          scrollY.value > tolerance &&
          scrollY.value >= lastScrollUpStopValue.value + tolerance
        ) {
          lastScrollDownStopValue.value = scrollY.value;
          lastScrollValue.value = scrollY.value;
          runOnJS(setShowMenu)(false);
          return;
        }

        if (
          isScrollingUp &&
          lastScrollDownStopValue.value > 0 &&
          scrollY.value <= lastScrollDownStopValue.value - scrollUpTolerance
        ) {
          lastScrollUpStopValue.value = scrollY.value;
          lastScrollValue.value = scrollY.value;
          runOnJS(setShowMenu)(true);
          return;
        }
      } else {
        lastScrollValue.value = scrollY.value;
        lastScrollDownStopValue.value = scrollY.value;
        lastScrollUpStopValue.value = scrollY.value;
        if (!showMenu) {
          runOnJS(setShowMenu)(true);
        }
      }
    },
  });

  const router = useRouter();

  const goToCrossReferencesScreen = async (verseId: number) => {
    if (selectedVerseId === verseId) {
      router.push(Helper.buildCrossReferencesUrl(verseId));
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

  const menuAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: menuTranslateY.value },
        { scale: menuScale.value },
      ],
      opacity: menuOpacity.value,
      shadowOpacity: menuShadowOpacity.value,
      shadowRadius: interpolate(menuShadowOpacity.value, [0, 0.3], [0, 8]),
      shadowOffset: {
        width: 0,
        height: interpolate(menuShadowOpacity.value, [0, 0.3], [0, 4]),
      },
      elevation: interpolate(menuShadowOpacity.value, [0, 0.3], [0, 8]),
    };
  });

  return (
    <Screen>
      {chapter ? (
        <>
          <Animated.ScrollView
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
              scrollViewLayoutHeight.value = height;
            }}
            onContentSizeChange={(w, h) => {
              scrollViewHeight.value = h;
            }}
          >
            <Text style={styles.bookName}>{chapter?.bookName}</Text>
            <Text style={styles.chapterNumber}>{chapter?.chapterNumber}</Text>
            {chapter?.verses.map((item) => renderItem({ item }))}
            <Text style={styles.about}>~</Text>
          </Animated.ScrollView>

          <Animated.View style={[styles.menu, menuAnimatedStyle]}>
            <ReferencesMenu
              versionId={versionId}
              chapterId={chapterId}
              bookId={chapter.bookId}
              bookName={chapter?.bookName ?? ""}
              chapterNumber={chapter?.chapterNumber ?? 0}
            ></ReferencesMenu>
          </Animated.View>
        </>
      ) : (
        <Loader />
      )}
    </Screen>
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
