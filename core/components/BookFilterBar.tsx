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
  selectedBookId,
  onToggle,
  onClearAll,
  visible,
  theme,
}: {
  books: BookSection[];
  selectedBookId: number;
  onToggle: (bookId: number) => void;
  onClearAll: () => void;
  visible: boolean;
  theme: 'dark' | 'light';
}) {
  const styles = buildStyleSheet(theme);

  if (!visible) return null;

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
          selected={selectedBookId === 0}
          onPress={onClearAll}
          theme={theme}
        />

        <View style={styles.divider} />

        {books.map((book) => (
          <BookChip
            key={book.bookId}
            label={book.bookName}
            count={book.count}
            selected={selectedBookId === book.bookId}
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
