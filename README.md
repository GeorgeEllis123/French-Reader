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
Camera Integration
- Photo capture using Expo Camera
- Freeze-frame preview before processing
- Retake or confirm photo flow
- Runs on real iOS devices via Expo Go

OCR (Text Recognition)
- Image upload to backend
- Text extraction using Google Vision API
- Full extracted text rendering in-app
- Interactive Text System
- Highlight selectable text
- Support for multiple highlighted sections
- Handles multi-line selections
- Converts highlights into interactive buttons

Action Sheet UI
- Bottom sheet component
- Displays selected text
- Close button (top left)
- "Translate" and "Grammar" action buttons
- Loading state handling for async actions

Translation Pipeline
- DeepL API integration (server-side)
- /translate Express endpoint
- Environment variable configuration for API keys
- End-to-end flow: highlight → action sheet → backend → translated result

Backend Infrastructure
- Express server
- /ocr endpoint for image processing
- CORS configuration for local device testing
- Secure API key handling via .env

### 🛠 In Progress
- Grammar explanation logic

---

## 🧱 Tech Stack

### Frontend
- Expo (React Native)
- TypeScript
- expo-router
- expo-camera
- Asynch Storage (temporary)

### Backend
- Node.js
- Express
- CORS
- Multer
- Google Vision API (OCR)
- DeepL API (Translations)

---

## 🛠 Local Development

### Prerequisites
- Node.js (v18+ recommended)
- npm
- Expo Go app on iOS or Android
- Phone and computer on same Wi-Fi network

---

### Run Frontend

```bash
npx expo start --tunnel
```

### Run Backend
```bash
cd backend
node index.js
```

