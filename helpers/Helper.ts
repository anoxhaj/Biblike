export function buildChapterUrl(versionId: number, chapterId: number): string {
  return "/read?versionId=" + versionId + "&chapterId=" + chapterId;
}

export function buildCrossReferencesUrl(verseId: number): string {
  return `/crossReferences?verseId=${verseId}`;
}
