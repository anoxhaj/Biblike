export function formatVersesForCopy({
  bookName,
  chapterNumber,
  versionAbbreviation,
  verses,
}: {
  bookName: string;
  chapterNumber: number;
  versionAbbreviation?: string;
  verses: { number: number; text: string }[];
}): string {
  const versesText = verses.map((v) => `${v.number}. ${v.text}`).join('\n');

  return `${bookName} ${chapterNumber} (${versionAbbreviation}) \n\n${versesText}`;
}
