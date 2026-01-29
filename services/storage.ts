import { Platform } from "react-native";

/**
 * Сохраняет строку по ключу.
 * Web: localStorage. Native: expo-secure-store (require только на native, чтобы не грузить модуль на вебе).
 */
export async function setToken(key: string, value: string): Promise<void> {
  if (Platform.OS === "web") {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, value);
    }
    return;
  }
  const SecureStore = require("expo-secure-store");
  await SecureStore.setItemAsync(key, value);
}

/**
 * Возвращает значение по ключу.
 * Web: localStorage. Native: expo-secure-store.
 */
export async function getToken(key: string): Promise<string | null> {
  if (Platform.OS === "web") {
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem(key);
    }
    return null;
  }
  const SecureStore = require("expo-secure-store");
  return await SecureStore.getItemAsync(key);
}

/**
 * Удаляет значение по ключу.
 * Web: localStorage. Native: expo-secure-store.
 */
export async function deleteToken(key: string): Promise<void> {
  if (Platform.OS === "web") {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(key);
    }
    return;
  }
  const SecureStore = require("expo-secure-store");
  await SecureStore.deleteItemAsync(key);
}
