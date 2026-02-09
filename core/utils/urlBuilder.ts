export const urlBuilder = {
  chapter(versionId: number, chapterId: number): string {
    return "/read?versionId=" + versionId + "&chapterId=" + chapterId;
  },
  crossReference(verseId: number): string {
    return `/crossReferences?verseId=${verseId}`;
  },
};
