const express = require("express");
const multer = require("multer");
const cors = require("cors");
const vision = require("@google-cloud/vision");

require("dotenv").config();

const app = express();
app.use(cors());

app.use(express.json());

const upload = multer({ dest: "uploads/" });

// Create Vision client using your service account key
const client = new vision.ImageAnnotatorClient({
  keyFilename: "google-vision-key.json",
});

/* =========================
   OCR (Google Vision)
========================= */
app.post("/ocr", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const [result] = await client.textDetection(req.file.path);
    const text = result.fullTextAnnotation?.text || "";

    res.json({ text });
  } catch (err) {
    console.error("OCR error:", err);
    res.status(500).json({ error: "OCR failed" });
  }
});

/* =========================
   TRANSLATION (DeepL)
========================= */
app.post("/translate", async (req, res) => {
  try {
    const { text } = req.body;
    console.log("Translating text:", text);

    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    const response = await fetch("https://api-free.deepl.com/v2/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
      },
      body: JSON.stringify({
        text,
        source_lang: "FR",
        target_lang: "EN",
      }),
    });

    const data = await response.json();

    console.log("Translated to:", data.translations[0].text);

    res.json({
      translation: data.translations[0].text,
    });
  } catch (err) {
    console.error("Translation error:", err);
    res.status(500).json({ error: "Translation failed" });
  }
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});
