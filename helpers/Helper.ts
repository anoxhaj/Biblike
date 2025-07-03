export function buildChapterUrl(versionId: number, chapterId: number): string {
  return "/bible/" + versionId + "/" + chapterId;
}

export function buildCrossReferencesUrl(verseId: number): string {
  return `/bible/crossReferences?verseId=${verseId}`;
}
