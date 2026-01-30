import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "readings";

// --- USER INFORMATION --- //
// - activeReadingId (Crypto.randomUUID): the reading the user has open

export async function getActiveReadingId() {
  return AsyncStorage.getItem("activeReadingId");
}

export async function setActiveReadingId(readingId: string) {
  return AsyncStorage.setItem("activeReadingId", readingId);
}

// --- READING STORAGE INFORMATION  --- //

// Loads the list of readings from storage
export async function loadReadings() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

// Saves the list of readings to storage
export async function saveReadings(readings: any[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(readings));
}

export async function deleteReading(readingId: string) {
  const readings = await loadReadings();
  const updatedReadings = readings.filter((r: any) => r.id !== readingId);
  await saveReadings(updatedReadings);
}

// Clears all readings from storage
export async function clearReadings() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
