import * as Crypto from "expo-crypto";
import { loadReadings, saveReadings } from "./storage";

// Creates a new reading with the given title and returns its ID
export async function createNewReading(title: string) {
  const readings = await loadReadings();
  const newReading = {
    id: Crypto.randomUUID(),
    title,
    createdAt: Date.now(),
    pages: [],
  };
  readings.push(newReading);
  await saveReadings(readings);

  return newReading.id;
}

// Saves a new page with imageUri and text to the most recent reading
export async function savePageToReading(
  imageUri: string,
  text: string
) {
  const readings = await loadReadings();

  let reading = readings[0];

  if (!reading) {
    reading = {
      id: Crypto.randomUUID(),
      title: "Untitled Reading",
      createdAt: Date.now(),
      pages: [],
    };
    readings.push(reading);
  }

  reading.pages.push({
    id: Crypto.randomUUID(),
    pageNumber: reading.pages.length + 1,
    imageUri,
    text,
    createdAt: Date.now(),
  });

  await saveReadings(readings);
}
