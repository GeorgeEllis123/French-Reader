const express = require("express");
const multer = require("multer");
const cors = require("cors");
const vision = require("@google-cloud/vision");

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

// Create Vision client using your service account key
const client = new vision.ImageAnnotatorClient({
  keyFilename: "google-vision-key.json",
});

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

app.listen(3000, "0.0.0.0", () => {
  console.log("OCR server running on port 3000");
});
