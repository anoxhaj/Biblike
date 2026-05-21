export const urlBuilder = {
  chapter(versionId: number, chapterId: number, verseId?: number): string {
    return '/read?versionId=' + versionId + '&chapterId=' + chapterId + '&verseId=' + verseId;
  },
  crossReference(verseId: number): string {
    return `/crossReferences?verseId=${verseId}`;
  },
  search(): string {
    return '/search';
  },
};
