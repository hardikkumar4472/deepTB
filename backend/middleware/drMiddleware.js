import jwt from "jsonwebtoken";
import doctorSchema from "../models/dr.js"

export const doctorAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const doctor = await doctorSchema.findById(decoded.id);
    if (!doctor) {
      return res.status(403).json({ msg: "Access denied. Doctor account not found." });
    }

    if (!doctor.isActive) {
      return res.status(403).json({ msg: "Doctor account is deactivated. Contact admin." });
    }

    if (!doctor.isVerified) {
      return res.status(403).json({ msg: "Doctor not verified yet." });
    }

    req.doctor = doctor;
    next();
  } catch (err) {
    console.error("Doctor auth error:", err);
    res.status(401).json({ msg: "Token invalid or expired" });
  }
};
