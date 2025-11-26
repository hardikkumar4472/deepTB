import express from "express";
import { 
  doctorSignup, 
  doctorLogin, 
  getDoctorProfile,
  updateDoctorProfile,
  checkDoctorExists
} from "../controllers/drController.js";
import { authMiddleware } from "../middleware/auth.js";
import { doctorAuth } from "../middleware/drMiddleware.js";

const drRoutes = express.Router();

drRoutes.post("/signup", doctorSignup);
drRoutes.post("/login", doctorLogin);
drRoutes.get("/check", checkDoctorExists);

drRoutes.get("/profile", doctorAuth, getDoctorProfile);
drRoutes.put("/profileUpdate", doctorAuth, updateDoctorProfile);

export default drRoutes;