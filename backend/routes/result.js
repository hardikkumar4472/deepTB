import express from "express";
import result from "../models/result.js";
import { authMiddleware } from "../middleware/auth.js";
import { doctorAuth } from "../middleware/drMiddleware.js";

const resultRoutes = express.Router();

resultRoutes.get("/history", authMiddleware, async (req, res) => {
  try {
    const results = await result.find({ userId: req.user.id }).sort({ createdAt: -1 });
    const totalReports = results.length;
    res.json(results,totalReports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
resultRoutes.get("/count", authMiddleware, async (req, res) => {
  try {
    const totalReports = await result.countDocuments({ userId: req.user.id });
    res.json({
      success: true,
      totalReports,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

resultRoutes.get("/patient/:patientId", doctorAuth, async (req, res) => {
  try {
    const { patientId } = req.params;
    
    if (!patientId) {
      return res.status(400).json({ success: false, error: "Patient ID is required" });
    }
    if (!patientId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, error: "Invalid patient ID format" });
    }

    const results = await result.find({ userId: patientId }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      results: results || [],
      count: results.length,
      message: `Found ${results.length} results for patient`
    });
  } catch (err) {
    console.error("Get patient results error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default resultRoutes;

