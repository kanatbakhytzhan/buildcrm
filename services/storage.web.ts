/**
 * Хранилище токена для веба. Только localStorage — без expo-secure-store,
 * чтобы веб-бандл не подключал нативный модуль и не падал.
 */
import { Platform } from "react-native";

function getStorage(): Storage | null {
  if (Platform.OS !== "web") return null;
  if (typeof localStorage === "undefined") return null;
  return localStorage;
}

export async function setToken(key: string, value: string): Promise<void> {
  const storage = getStorage();
  if (storage) storage.setItem(key, value);
}

export async function getToken(key: string): Promise<string | null> {
  const storage = getStorage();
  return storage ? storage.getItem(key) : null;
}

export async function deleteToken(key: string): Promise<void> {
  const storage = getStorage();
  if (storage) storage.removeItem(key);
}
