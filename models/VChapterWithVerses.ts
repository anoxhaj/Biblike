import { SQLiteDatabase } from "expo-sqlite";

export interface VChapterWithVerses {
  id: number;
  bookName: string;
  bookId: number;
  chapterNumber: number;
  verses: Verse[];
}

// CHILDREN
export interface Verse {
  id: number;
  number: number;
  text: string;
}

// HELPERS
interface Helper {
  chapter_id: number;
  book_name: string;
  chapter_number: number;
  verse_id: number;
  verse_number: number;
  verse_text: string;
  book_id: number;
}

// READ
export async function GetChapterByIdAsync(
  db: SQLiteDatabase,
  version_id: number,
  chapter_id: number
): Promise<VChapterWithVerses> {
  let data = await db.getAllAsync<Helper>(
    `SELECT
      verses.chapter_id AS chapter_id,
      book_translations.name AS book_name,
      chapters.number AS chapter_number,
      verses.id AS verse_id,
      verses.number AS verse_number,
      verse_texts.text AS verse_text,
      chapters.book_id AS book_id
    FROM
      versions
      INNER JOIN book_translations ON versions.language_id = book_translations.language_id
      INNER JOIN verse_texts ON versions.id = verse_texts.version_id
      INNER JOIN verses ON verse_texts.verse_id = verses.id
      INNER JOIN chapters ON chapters.book_id = book_translations.book_id
    WHERE
      verse_texts.version_id = $version_id
      AND verses.chapter_id = $chapter_id
      AND chapters.id = $chapter_id`,
    { $version_id: version_id, $chapter_id: chapter_id }
  );

  const chapter: VChapterWithVerses = {
    id: data[0].chapter_id,
    bookName: data[0].book_name,
    bookId: data[0].book_id,
    chapterNumber: data[0].chapter_number,
    verses: [],
  };

  const result = data.reduce<VChapterWithVerses>(
    (acc: VChapterWithVerses, item: Helper) => {
      let verse = acc.verses.find((i) => i.id === item.verse_id);

      if (verse == undefined) {
        verse = {
          id: item.verse_id,
          number: item.verse_number,
          text: item.verse_text,
        };
        acc.verses.push(verse);
      }

      return acc;
    },
    chapter
  );

  return result;
}
