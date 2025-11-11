// server/index.js
import express from "express";
import multer from "multer";
import cors from "cors";
import sharp from "sharp";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

// Convert endpoint: POST /api/convert?format=png
app.post("/api/convert", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("No file uploaded.");
    const { format } = req.query;
    const allowed = ["png", "jpg", "jpeg", "webp", "gif"];
    const target = (format || "").toLowerCase();

    if (!allowed.includes(target)) {
      return res.status(400).send("Invalid format. Allowed: png, jpg, webp, gif.");
    }

    const inputPath = req.file.path;
    // ensure file ext for download filename
    const outFilename = `converted.${target === "jpeg" ? "jpg" : target}`;
    const outputPath = path.join("uploads", `${req.file.filename}.${target}`);

    // Use Sharp to convert; for gif -> sharp only writes animated gifs if input is animated and you use toFormat('gif')
    await sharp(inputPath).toFormat(target === "jpg" ? "jpeg" : target).toFile(outputPath);

    // Send file as attachment
    res.download(outputPath, outFilename, (err) => {
      // cleanup both files
      try { fs.unlinkSync(inputPath); } catch(e) {}
      try { fs.unlinkSync(outputPath); } catch(e) {}
      if (err) console.error("Send error:", err);
    });
  } catch (err) {
    console.error("Conversion error:", err);
    // Try best effort cleanup
    if (req?.file?.path) {
      try { fs.unlinkSync(req.file.path); } catch(e) {}
    }
    res.status(500).send("Conversion failed: " + (err.message || "unknown error"));
  }
});

// Basic health check
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Global error handler for multer / other errors
app.use((err, req, res, next) => {
  console.error("Global error:", err.message);
  res.status(400).send(err.message || "Error");
});
// ------------------ existing code above ------------------

const __dirname = path.resolve();

// ✅ Serve React build (for production)
app.use(express.static(path.join(__dirname, "../client/my/my/build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/my/my/build", "index.html"));
});

// ------------------ start server ------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));


