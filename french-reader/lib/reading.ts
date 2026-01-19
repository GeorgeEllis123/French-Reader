import * as Crypto from "expo-crypto";
import { loadReadings, saveReadings } from "./storage";

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
