import * as AppSettings from "../constants/AppSettings";

export function buildChapterUrl(versionId: number, chapterId: number): string {
  return "/bible/" + versionId + "/" + chapterId;
}

export function buildCrossReferencesUrl(
  versionId: number,
  verseId: number
): string {
  AppSettings.CONFIGS.VERSION.value = versionId;
  AppSettings.CONFIGS.VERSE.value = verseId;
  return "/bible/crossReferences";
}
