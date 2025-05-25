import { SQLiteDatabase } from "expo-sqlite";

export interface VCrossReferences {
  id: number;
  from: number;
  to: number;
  bookName: string;
  chapterNumber: number;
  verseNumberFrom: number;
  verseNumberTo: number;
  verses: Verse[];
  votes: number;
}

// CHILDREN

export interface Verse {
  verseId: number;
  verseNumber: number;
  verseText: string;
}

// HELPERS
interface Helper {
  id: number;
  from: number;
  to: number;
  book_name: string;
  chapter_number: number;
  verse_id: number;
  verse_number: number;
  verse_text: string;
  votes: number;
}

// READ
export async function GetByVerseIdAsync(
  db: SQLiteDatabase,
  version_id: number,
  verse_id: number
): Promise<VCrossReferences[]> {
  let data = await db.getAllAsync<Helper>(
    `SELECT
    verse_cross_references.id AS id,
    verse_cross_references.cross_verse_from AS [from],
    verse_cross_references.cross_verse_to AS [to],
    book_translations.name AS book_name,
    chapters.number AS chapter_number,
    verses.id AS verse_id,
    verses.number AS verse_number,
    verse_texts.text AS verse_text,
    verse_cross_references.votes AS votes
FROM 
    verse_cross_references
    JOIN verse_texts ON verse_texts.verse_id BETWEEN verse_cross_references.cross_verse_from AND verse_cross_references.cross_verse_to
    INNER JOIN verses ON verse_texts.verse_id = verses.id
    INNER JOIN versions ON verse_texts.version_id = versions.id
    INNER JOIN book_translations ON versions.language_id = book_translations.language_id
    INNER JOIN chapters ON chapters.book_id = book_translations.book_id AND verses.chapter_id = chapters.id
WHERE 
    verse_cross_references.verse_id = $verse_id
    AND verse_texts.version_id = $version_id`,
    { $version_id: version_id, $verse_id: verse_id }
  );

  const result = data.reduce<VCrossReferences[]>(
    (acc: VCrossReferences[], item: Helper) => {
      let cross = acc.find((i) => i.id === item.id);

      if (cross == undefined) {
        cross = {
          id: item.id,
          from: item.from,
          to: item.to,
          bookName: item.book_name,
          chapterNumber: item.chapter_number,
          verseNumberFrom: item.verse_number,
          verseNumberTo: item.verse_number,
          verses: [
            {
              verseId: item.verse_id,
              verseText: item.verse_text,
              verseNumber: item.verse_number,
            },
          ],
          votes: item.votes,
        };
        acc.push(cross);
      } else {
        let index = acc.indexOf(cross);

        if (cross.verseNumberFrom > item.verse_number)
          cross.verseNumberFrom = item.verse_number;
        else if (cross.verseNumberTo < item.verse_number)
          cross.verseNumberTo = item.verse_number;

        cross.verses.push({
          verseId: item.verse_id,
          verseNumber: item.verse_number,
          verseText: item.verse_text,
        });

        cross.verses.sort((a, b) => a.verseNumber - b.verseNumber);

        acc[index] = cross;
      }

      return acc;
    },
    []
  );

  result.sort((a, b) => b.votes - a.votes);

  return result;
}
