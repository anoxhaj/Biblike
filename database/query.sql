SELECT
    books.Id AS book_id,
    books.code AS book_code,
    book_translations.name AS book_name,
    chapters.id AS chapter_id,
    chapters.number AS chapter_no
FROM
    books
    INNER JOIN book_translations ON books.id = book_translations.book_id
    INNER JOIN chapters ON books.id = chapters.book_id;
    
SELECT
    verses.number,
    verse_texts.text
FROM
    verses
    INNER JOIN verse_texts ON verses.id = verse_texts.verse_id
WHERE
    verses.chapter_id = 1
    AND verse_texts.version_id = 1
