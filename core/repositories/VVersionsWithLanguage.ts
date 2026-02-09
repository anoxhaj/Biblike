import { SQLiteDatabase } from "expo-sqlite";

export interface VVersionsWithLanguage {
  id: number;
  name: string;
  abbreviation: string;
  year: number;
  languageName: string;
}

// READ
export async function GetAllAsync(
  db: SQLiteDatabase
): Promise<VVersionsWithLanguage[]> {
  let data = await db.getAllAsync<VVersionsWithLanguage>(
    `SELECT 
    versions.id,
    versions.name,
    versions.abbreviation,
    versions.year,
    languages.name AS languageName
FROM
    versions
    INNER JOIN languages ON versions.language_id = languages.id`
  );

  return data;
}
