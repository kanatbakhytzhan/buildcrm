import { Platform } from "react-native";

// На вебе используем localStorage, на нативных платформах — expo-secure-store
let SecureStore: typeof import("expo-secure-store") | null = null;
if (Platform.OS !== "web") {
  SecureStore = require("expo-secure-store");
}

/**
 * Сохраняет строку по ключу.
 * Web: localStorage, iOS/Android: expo-secure-store.
 */
export const saveToken = async (key: string, value: string): Promise<void> => {
  try {
    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(key, value);
      }
    } else if (SecureStore) {
      await SecureStore.setItemAsync(key, value);
    }
  } catch (error) {
    console.error("storage saveToken error:", error);
  }
};

/**
 * Возвращает значение по ключу.
 * Web: localStorage, iOS/Android: expo-secure-store.
 */
export const getToken = async (key: string): Promise<string | null> => {
  try {
    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") {
        return localStorage.getItem(key);
      }
      return null;
    }
    if (SecureStore) {
      return await SecureStore.getItemAsync(key);
    }
    return null;
  } catch (error) {
    console.error("storage getToken error:", error);
    return null;
  }
};

/**
 * Удаляет значение по ключу.
 * Web: localStorage, iOS/Android: expo-secure-store.
 */
export const deleteToken = async (key: string): Promise<void> => {
  try {
    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem(key);
      }
    } else if (SecureStore) {
      await SecureStore.deleteItemAsync(key);
    }
  } catch (error) {
    console.error("storage deleteToken error:", error);
  }
};
