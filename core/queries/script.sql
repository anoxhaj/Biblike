SELECT v.*
FROM verse_texts v
JOIN verse_texts_fts f
  ON v.id = f.rowid
WHERE verse_texts_fts MATCH 'bu*'
  AND v.version_id = 1;