import { useCallback, useEffect, useRef, useState } from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';

import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';

import Animated from 'react-native-reanimated';

import Loader from '@/core/components/Loader';
import ReferencesMenu from '@/core/components/ReferencesMenu';
import Screen from '@/core/components/Screen';
import TopMenu from '@/core/components/TopMenu';
import Verse from '@/core/components/Verse';
import { STYLES } from '@/core/constants';
import { useColorSchemeDefault } from '@/core/hooks';
import { useHideOnScroll } from '@/core/hooks/useHideOnScroll';
import * as vcwv from '@/core/repositories/VChapterWithVerses';
import { useUpdateConfig, useVersions } from '@/core/stores/configs';
import { urlBuilder } from '@/core/utils';

export default function Reader({
  versionId,
  chapterId,
  verseId,
}: {
  versionId: number;
  chapterId: number;
  verseId?: number;
}) {
  const router = useRouter();
  const db = useSQLiteContext();

  const theme = useColorSchemeDefault();
  const styles = BuildStyleSheet(theme);

  const updateConfig = useUpdateConfig();
  const versions = useVersions();

  const [showReferencesMenu, setShowReferencesMenu] = useState(true);
  const { showMenu, handleScroll, onLayout, onContentSizeChange } = useHideOnScroll();

  const scrollViewRef = useRef<Animated.ScrollView>(null);

  const versePositions = useRef<Record<number, number>>({});

  const [chapter, setChapter] = useState<vcwv.VChapterWithVerses>();

  const [selectedVerseId, setSelectedVerseId] = useState<number | null>(null);

  const [copyMode, setCopyMode] = useState(false);
  const [selectedVerseIds, setSelectedVerseIds] = useState<number[]>([]);

  const fetchChapter = useCallback(() => {
    async function fetch() {
      await db.withExclusiveTransactionAsync(async () => {
        setChapter(await vcwv.GetChapterByIdAsync(db, versionId, chapterId));

        await updateConfig('CHAPTER', chapterId, db);
      });
    }

    fetch();
  }, [db, versionId, chapterId, updateConfig]);

  useEffect(() => {
    fetchChapter();
  }, [fetchChapter]);

  useEffect(() => {
    if (chapter && verseId) {
      setSelectedVerseId(verseId);

      requestAnimationFrame(() => {
        const y = versePositions.current[verseId];

        if (y != null) {
          scrollViewRef.current?.scrollTo({
            y: y - 300,
            animated: true,
          });
        }
      });
    }
  }, [chapter, verseId]);

  const toggleVerseSelection = (currentVerseId: number) => {
    setSelectedVerseIds((prev) => {
      if (prev.includes(currentVerseId)) {
        const next = prev.filter((id) => id !== currentVerseId);

        if (next.length == 0) {
          exitCopyMode();
          return [];
        }

        return next;
      }

      return [...prev, currentVerseId];
    });
  };

  const handleVersePress = async (currentVerseId: number) => {
    if (copyMode) {
      toggleVerseSelection(currentVerseId);
      return;
    }

    if (selectedVerseId === currentVerseId) {
      router.push(urlBuilder.crossReference(currentVerseId));
      return;
    }

    setSelectedVerseId(currentVerseId);
  };

  const handleVerseLongPress = (currentVerseId: number) => {
    setSelectedVerseId(null);

    if (copyMode) {
      toggleVerseSelection(currentVerseId);
      return;
    }

    setShowReferencesMenu(false);
    setCopyMode(true);
    setSelectedVerseIds([currentVerseId]);
  };

  const exitCopyMode = () => {
    setShowReferencesMenu(true);

    if (showMenu.value == 1) setSelectedVerseIds([]);

    const t = setTimeout(() => {
      setCopyMode(false);

      if (showMenu.value == 0) setSelectedVerseIds([]);
    }, 300);

    return () => clearTimeout(t);
  };

  const handleCopy = async () => {
    if (!chapter) return;

    const verses = chapter.verses
      .filter((v) => selectedVerseIds.includes(v.id))
      .sort((a, b) => a.number - b.number);

    const versionText = versions.find((v) => v.id === versionId)?.abbreviation;

    const versesText = verses.map((v) => `${v.number}. ${v.text}`).join('\n');

    const finalText = `${chapter.bookName} ${chapter.chapterNumber} (${versionText}) \n\n${versesText}`;

    await Clipboard.setStringAsync(finalText);

    exitCopyMode();
  };

  const renderItem = ({ item }: { item: vcwv.Verse }) => (
    <Verse
      key={item.id}
      id={item.id}
      number={item.number}
      text={item.text}
      selected={copyMode ? selectedVerseIds.includes(item.id) : selectedVerseId === item.id}
      onPress={handleVersePress}
      onLongPress={handleVerseLongPress}
      onLayout={(event) => {
        versePositions.current[item.id] = event.nativeEvent.layout.y;
      }}
    />
  );

  return (
    <Screen>
      {chapter ? (
        <>
          <TopMenu show={showMenu} chapterId={chapterId} />

          <Animated.ScrollView
            ref={scrollViewRef}
            overScrollMode="never"
            contentContainerStyle={{
              paddingTop: 60,
              paddingBottom: 120,
              backgroundColor: STYLES.COLORS[theme].BACKGROUND.PRIMARY,
            }}
            style={{ flex: 1 }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            onLayout={onLayout}
            onContentSizeChange={onContentSizeChange}
          >
            <Text style={styles.bookName}>{chapter.bookName}</Text>

            <Text style={styles.chapterNumber}>{chapter.chapterNumber}</Text>

            {chapter.verses.map((item) => renderItem({ item }))}

            <Text style={styles.about}>~</Text>
          </Animated.ScrollView>

          {showReferencesMenu && (
            <ReferencesMenu
              show={showMenu}
              versionId={versionId}
              chapterId={chapterId}
              bookId={chapter.bookId}
              bookName={chapter.bookName ?? ''}
              chapterNumber={chapter.chapterNumber ?? 0}
            />
          )}

          {copyMode && (
            <View style={styles.copyBar}>
              <Text style={styles.copyText}>{selectedVerseIds.length} selected</Text>

              <View style={styles.copyActions}>
                <Pressable onPress={exitCopyMode}>
                  <Text style={styles.copyAction}>Cancel</Text>
                </Pressable>

                <Pressable onPress={handleCopy}>
                  <Text style={styles.copyAction}>Copy</Text>
                </Pressable>
              </View>
            </View>
          )}
        </>
      ) : (
        <Loader />
      )}
    </Screen>
  );
}

function BuildStyleSheet(theme: 'dark' | 'light') {
  return StyleSheet.create({
    bookName: {
      textAlign: 'center',
      fontFamily: STYLES.FONT.BOLD,
      fontSize: 21,
      color: STYLES.COLORS[theme].TEXT.PRIMARY,
    },
    chapterNumber: {
      textAlign: 'center',
      fontFamily: STYLES.FONT.BOLD,
      fontSize: 66,
      color: STYLES.COLORS[theme].TEXT.PRIMARY,
    },
    about: {
      textAlign: 'center',
      paddingTop: 120,
      paddingBottom: 30,
      fontFamily: STYLES.FONT.ITALIC,
      fontSize: 21,
      color: STYLES.COLORS[theme].TEXT.PRIMARY,
    },
    copyBar: {
      position: 'absolute',
      bottom: 12,
      left: 12,
      right: 12,
      height: 45,
      paddingHorizontal: 21,
      paddingVertical: 3,
      borderRadius: 21,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: STYLES.COLORS[theme].BACKGROUND.SECONDARY,
    },
    copyText: {
      fontFamily: STYLES.FONT.BOLD,
      fontSize: 16,
      color: STYLES.COLORS[theme].TEXT.PRIMARY,
    },
    copyActions: {
      flexDirection: 'row',
      gap: 20,
    },
    copyAction: {
      fontFamily: STYLES.FONT.BOLD,
      fontSize: 16,
      color: STYLES.COLORS[theme].TEXT.PRIMARY,
    },
  });
}
