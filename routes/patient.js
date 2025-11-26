
import express from "express";
import { doctorAuth } from "../middleware/drMiddleware.js";
import { getAllPatients, getPatientById, getPatientHistory } from "../controllers/patientController.js";

const patientRoutes = express.Router();
patientRoutes.get("/", doctorAuth, getAllPatients);
patientRoutes.get("/:id", doctorAuth, getPatientById);
patientRoutes.get("/:id/history", doctorAuth, getPatientHistory);

export default patientRoutes;