import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "readings";

export async function loadReadings() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveReadings(readings: any[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(readings));
}
