import { SQLiteDatabase } from "expo-sqlite";

export interface VSearchResult {
  id: number;
  verseId: number;
  verseNumber: number;
  text: string;
  chapterId: number;
  chapterNumber: number;
  bookName: string;
  bookId: number;
}

// HELPERS
interface Helper {
  verse_text_id: number;
  verse_id: number;
  verse_number: number;
  verse_text: string;
  chapter_id: number;
  chapter_number: number;
  book_name: string;
  book_id: number;
}

// READ
export async function SearchVersesByTextAsync(
  db: SQLiteDatabase,
  version_id: number,
  searchQuery: string,
): Promise<VSearchResult[]> {
  const formattedQuery = `${searchQuery}*`;

  let data = await db.getAllAsync<Helper>(
    `SELECT
      verse_texts.id AS verse_text_id,
      verses.id AS verse_id,
      verses.number AS verse_number,
      verse_texts.text AS verse_text,
      chapters.id AS chapter_id,
      chapters.number AS chapter_number,
      book_translations.name AS book_name,
      books.id AS book_id
    FROM
      verse_texts
      JOIN verse_texts_fts ON verse_texts.id = verse_texts_fts.rowid
      JOIN verses ON verse_texts.verse_id = verses.id
      JOIN chapters ON verses.chapter_id = chapters.id
      JOIN books ON chapters.book_id = books.id
      JOIN book_translations ON books.id = book_translations.book_id
      JOIN versions ON verse_texts.version_id = versions.id
    WHERE
      verse_texts_fts MATCH $searchQuery
      AND verse_texts.version_id = $version_id
      AND book_translations.language_id = versions.language_id
    ORDER BY
      books.id ASC,
      chapters.number ASC,
      verses.number ASC`,
    { $searchQuery: formattedQuery, $version_id: version_id },
  );

  const results: VSearchResult[] = data.map((item) => ({
    id: item.verse_text_id,
    verseId: item.verse_id,
    verseNumber: item.verse_number,
    text: item.verse_text,
    chapterId: item.chapter_id,
    chapterNumber: item.chapter_number,
    bookName: item.book_name,
    bookId: item.book_id,
  }));

  return results;
}
