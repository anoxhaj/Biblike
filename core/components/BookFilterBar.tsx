import { ScrollView, StyleSheet, View } from 'react-native';

import { STYLES } from '@/core/constants';

import BookChip from './BookChip';

export interface BookSection {
  bookId: number;
  bookName: string;
  count: number;
  firstIndex: number;
}

export default function BookFilterBar({
  books,
  selectedBookIds,
  onToggle,
  onClearAll,
  visible,
  loadingBookId,
  theme,
}: {
  books: BookSection[];
  selectedBookIds: Set<number>;
  onToggle: (bookId: number) => void;
  onClearAll: () => void;
  visible: boolean;
  loadingBookId: number | null;
  theme: 'dark' | 'light';
}) {
  const styles = buildStyleSheet(theme);

  if (!visible) return null;

  const allSelected = selectedBookIds.size === 0;
  const totalCount = books.reduce((sum, b) => sum + b.count, 0);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <BookChip
          label="All"
          count={totalCount}
          selected={allSelected}
          loading={loadingBookId === -1}
          onPress={onClearAll}
          theme={theme}
        />

        <View style={styles.divider} />

        {books.map((book) => (
          <BookChip
            key={book.bookId}
            label={book.bookName}
            count={book.count}
            selected={selectedBookIds.has(book.bookId)}
            loading={loadingBookId === book.bookId}
            onPress={() => onToggle(book.bookId)}
            theme={theme}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function buildStyleSheet(theme: 'dark' | 'light') {
  return StyleSheet.create({
    container: {
      overflow: 'hidden',
    },
    scrollContent: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 30,
      paddingTop: 6,
      paddingBottom: 12,
    },
    divider: {
      width: 1.5,
      height: 30,
      backgroundColor: STYLES.COLORS[theme].BACKGROUND.SECONDARY,
      marginRight: 8,
      borderRadius: 1,
    },
  });
}
