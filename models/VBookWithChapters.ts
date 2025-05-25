import { SQLiteDatabase } from "expo-sqlite";

export interface VBookWithChapters {
  id: number;
  bookCode: string;
  bookName: string;
  chapters: Chapter[];
}

// CHILDREN
export interface Chapter {
  chapterId: number;
  chapterNo: number;
}

// HELPERS
interface Helper {
  book_id: number;
  book_code: string;
  book_name: string;
  chapter_id: number;
  chapter_no: number;
}

// READ
export async function GetAllByLanguageAsync(
  db: SQLiteDatabase,
  language_id: number
): Promise<VBookWithChapters[]> {
  let data = await db.getAllAsync<Helper>(
    `SELECT
      books.Id AS book_id,
      books.code AS book_code,
      book_translations.name AS book_name,
      chapters.id AS chapter_id,
      chapters.number AS chapter_no
    FROM
      books
      INNER JOIN book_translations ON books.id = book_translations.book_id
      INNER JOIN chapters ON books.id = chapters.book_id
    WHERE
      book_translations.language_id = $language_id;`,
    { $language_id: language_id }
  );

  const result = data.reduce<VBookWithChapters[]>(
    (acc: VBookWithChapters[], item: Helper) => {
      let book = acc.find((i) => i.id === item.book_id);

      if (book == undefined) {
        book = {
          id: item.book_id,
          bookCode: item.book_code,
          bookName: item.book_name,
          chapters: [],
        };
        acc.push(book);
      }

      book?.chapters.push({
        chapterId: item.chapter_id,
        chapterNo: item.chapter_no,
      });

      return acc;
    },
    []
  );

  return result;
}
