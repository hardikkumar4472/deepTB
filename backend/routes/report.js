import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { doctorAuth } from "../middleware/drMiddleware.js";
import {
  createReport,
  getPendingReports,
  reviewReport,
  getReport,
  getReportCount,
  getRejectedReports,
  getApprovedReports

} from "../controllers/reportController.js";

const reportRoutes = express.Router(); 
reportRoutes.get("/count", authMiddleware,getReportCount);
reportRoutes.post("/create", doctorAuth,createReport);
reportRoutes.get("/pending", doctorAuth, getPendingReports);
reportRoutes.post("/review/:reportId", doctorAuth, reviewReport);
reportRoutes.get("/:reportId", authMiddleware, getReport);
reportRoutes.get("/approved", doctorAuth, getApprovedReports); 
reportRoutes.get("/rejected", doctorAuth, getRejectedReports);


export default reportRoutes; 
