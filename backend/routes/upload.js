import express from "express";
import multer from "multer";
import { uploadToSupabase } from "../controllers/uploadController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
const upload = multer({ dest: "temp/" });
router.post("/", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const publicUrl = await uploadToSupabase(file);
    res.json({ url: publicUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
