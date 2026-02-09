import { SQLiteDatabase } from "expo-sqlite";

export interface Configs {
  key: string;
  value: string;
}

// READ
export async function GetAllAsync(db: SQLiteDatabase): Promise<Configs[]> {
  let data = await db.getAllAsync<Configs>(`SELECT * FROM configs;`);
  return data;
}

// UPDATE
export async function UpdateAsync(
  db: SQLiteDatabase,
  entity: Configs
): Promise<Configs> {
  await db.runAsync("UPDATE configs SET value = $value WHERE key = $key;", {
    $key: entity.key,
    $value: entity.value,
  });
  return entity;
}
