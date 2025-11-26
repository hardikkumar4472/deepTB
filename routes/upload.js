import express from "express";
import multer from "multer";
import { uploadToSupabase } from "../controllers/uploadController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// ✅ CHANGED: Use memory storage instead of dest: "temp/"
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  }
});

router.post("/", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const publicUrl = await uploadToSupabase(file);
    res.json({ url: publicUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
