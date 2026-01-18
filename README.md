# 📖 French Reader (MVP)

A mobile French language learning app focused on **learning by reading**, not flashcards.

Users photograph real-world French text (such as books, articles, and signs), convert it to text using OCR, and interact with the text through highlighting, translation, and grammar explanations.

This repository currently contains a **Expo-based mobile MVP**, focused on camera capture and OCR flow.

---

## ✨ Core Idea

In my experience learning languages, memorizing vocabulary and using basic language apps can only get you so far. What you really need to excel is to engage with native media. Not only is this more successful, but for most, it is more fun! So this app will not only be your language teacher but learning partner.

Note:
This app is targeted towards intermediate learners...

---

## 🚀 Current Features (MVP)

### ✅ Implemented
- 📸 Camera capture using **Expo Camera**
- 🧊 “Freeze frame” photo preview flow
- ❌ Retake photo option
- ➡️ Upload/confirm photo action (UI complete)
- 📱 Runs on real iOS devices via **Expo Go**

### 🛠 In Progress
- OCR (text extraction from images)
- Rendering extracted text in-app
- Highlighting text for interaction

---

## 🧱 Tech Stack

### Frontend (This Repo)
- **Expo (React Native)**
- **TypeScript**
- **expo-router**
- **expo-camera**
- On-device UI, image capture, and state management

### Backend (Planned / Separate Repo)
- **Node.js + Express**
- **Google Vision API (OCR)**
- Image upload → text extraction → response

> ⚠️ Google ML Kit does not run directly in Expo Go — OCR will be handled via backend.

---

## 🛠 Local Development

### Prerequisites
- Node.js (v18+ recommended)
- npm
- Expo Go app on iOS or Android
- Phone and computer on same Wi-Fi network

---

### Install & Run

```bash
npm install
npx expo start
