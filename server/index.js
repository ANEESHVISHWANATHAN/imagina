import express from "express";
import multer from "multer";
import cors from "cors";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Proper __dirname setup for ES modules (Render + local)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// ------------------ Image Upload + Convert ------------------

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
    const outFilename = `converted.${target === "jpeg" ? "jpg" : target}`;
    const outputPath = path.join("uploads", `${req.file.filename}.${target}`);

    await sharp(inputPath)
      .toFormat(target === "jpg" ? "jpeg" : target)
      .toFile(outputPath);

    res.download(outputPath, outFilename, (err) => {
      try { fs.unlinkSync(inputPath); } catch {}
      try { fs.unlinkSync(outputPath); } catch {}
      if (err) console.error("Send error:", err);
    });
  } catch (err) {
    console.error("Conversion error:", err);
    if (req?.file?.path) {
      try { fs.unlinkSync(req.file.path); } catch {}
    }
    res.status(500).send("Conversion failed: " + (err.message || "unknown error"));
  }
});

// ------------------ Health Check ------------------

app.get("/api/health", (req, res) => res.json({ ok: true }));

// ------------------ Global Error Handler ------------------

app.use((err, req, res, next) => {
  console.error("Global error:", err.message);
  res.status(400).send(err.message || "Error");
});

// ------------------ Serve React Build ------------------

// ✅ Absolute path to your React build folder
const buildPath = path.join(__dirname, "../client/my/my/build");

// ✅ Serve static files
app.use(express.static(buildPath));

// ✅ Catch-all route (Express v5 compatible)
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// ------------------ Start Server ------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
