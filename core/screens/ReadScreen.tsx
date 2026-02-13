import Animated from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { StyleSheet, Text } from 'react-native';
import { useState, useEffect, useCallback } from 'react';

import Verse from '@/core/components/Verse';
import Loader from '@/core/components/Loader';
import Screen from '@/core/components/Screen';
import { urlBuilder } from '@/core/utils';
import { STYLES } from '@/core/constants';
import ReferencesMenu from '@/core/components/ReferencesMenu';
import { useColorSchemeDefault } from '@/core/hooks';
import { useUpdateConfig } from '@/core/stores/configs';
import * as vcwv from '@/core/repositories/VChapterWithVerses';
import { useHideOnScroll } from '@/core/hooks/useHideOnScroll';

export default function Reader({ versionId, chapterId }: { versionId: number; chapterId: number }) {
  const router = useRouter();
  const db = useSQLiteContext();
  const theme = useColorSchemeDefault();
  const styles = BuildStyleSheet(theme);
  const updateConfig = useUpdateConfig();
  const { showMenu, handleScroll, onLayout, onContentSizeChange } = useHideOnScroll();

  const [chapter, setChapter] = useState<vcwv.VChapterWithVerses>();
  const [selectedVerseId, setSelectedVerseId] = useState<number | null>(null);

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

  const goToCrossReferencesScreen = async (verseId: number) => {
    if (selectedVerseId === verseId) {
      router.push(urlBuilder.crossReference(verseId));
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

  return (
    <Screen>
      {chapter ? (
        <>
          <Animated.ScrollView
            overScrollMode="never"
            contentContainerStyle={{
              paddingTop: 60,
              paddingBottom: 60,
              backgroundColor: STYLES.COLORS[theme].BACKGROUND.PRIMARY,
            }}
            style={{ flex: 1 }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            onLayout={onLayout}
            onContentSizeChange={onContentSizeChange}
          >
            <Text style={styles.bookName}>{chapter?.bookName}</Text>
            <Text style={styles.chapterNumber}>{chapter?.chapterNumber}</Text>
            {chapter?.verses.map((item) => renderItem({ item }))}
            <Text style={styles.about}>~</Text>
          </Animated.ScrollView>

          <ReferencesMenu
            show={showMenu}
            versionId={versionId}
            chapterId={chapterId}
            bookId={chapter.bookId}
            bookName={chapter?.bookName ?? ''}
            chapterNumber={chapter?.chapterNumber ?? 0}
          />
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
    itemContainer: {
      marginHorizontal: 30,
      marginVertical: 12,
    },
    itemText: {
      fontFamily: STYLES.FONT.REGULAR,
      fontSize: 21,
      lineHeight: 33,
      color: STYLES.COLORS[theme].TEXT.PRIMARY,
    },
    superscript: {
      fontFamily: STYLES.FONT.REGULAR,
      fontSize: 13,
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
  });
}
