
import Doctor from "../models/dr.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendDoctorWelcomeEmail, sendLoginNotification } from "../utils/DRauthBrevoEmail.js";

export const checkDoctorExists = async (req, res) => {
  try {
    const doctorCount = await Doctor.countDocuments();
    const hasDoctor = doctorCount > 0;

    res.json({
      success: true,
      hasDoctor,
      doctorCount
    });
  } catch (err) {
    console.error('Check doctor exists error:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

const canCreateDoctor = async () => {
  try {
    const existingDoctorCount = await Doctor.countDocuments();
    return existingDoctorCount < 1;
  } catch (error) {
    throw new Error('Error checking doctor count: ' + error.message);
  }
};

const updateDoctorLastLogin = async (doctorId) => {
  try {
    await Doctor.findByIdAndUpdate(doctorId, {
      lastLogin: new Date()
    });
  } catch (error) {
    console.error('Error updating last login:', error);
  }
};

const verifyDoctorAccount = async (doctorId) => {
  try {
    await Doctor.findByIdAndUpdate(doctorId, {
      isVerified: true,
      verificationDate: new Date()
    });
  } catch (error) {
    console.error('Error verifying doctor:', error);
  }
};

const getDoctorFullTitle = (doctor) => {
  return `Dr. ${doctor.name} - ${doctor.specialization}`;
};

const getDoctorExperienceLevel = (doctor) => {
  const exp = doctor.yearsOfExperience;
  if (exp < 2) return "Junior";
  if (exp < 5) return "Mid-Level";
  if (exp < 10) return "Senior";
  return "Expert";
};

export const getPrimaryDoctor = async () => {
  try {
    return await Doctor.findOne({}).select('-password');
  } catch (error) {
    throw new Error('Error getting primary doctor: ' + error.message);
  }
};

export const doctorSignup = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      password,
      licenseNumber,
      specialization,
      hospital,
      qualifications,
      yearsOfExperience
    } = req.body;

    const requiredFields = {
      name, email, phoneNumber, password, licenseNumber, specialization, hospital, yearsOfExperience
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        msg: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    const canCreate = await canCreateDoctor();
    if (!canCreate) {
      return res.status(403).json({
        success: false,
        msg: "System already has a registered doctor. Cannot create additional doctor accounts."
      });
    }

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        msg: "Doctor with this email already exists"
      });
    }

    const existingLicense = await Doctor.findOne({ licenseNumber });
    if (existingLicense) {
      return res.status(400).json({
        success: false,
        msg: "Doctor with this license number already exists"
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const doctor = new Doctor({
      name,
      email,
      phoneNumber,
      password: hashed,
      licenseNumber,
      specialization,
      hospital,
      qualifications: qualifications || [],
      yearsOfExperience,
      role: "head_doctor",
      isVerified: true,
      verificationDate: new Date()
    });

    await doctor.save();

    await verifyDoctorAccount(doctor._id);

    sendDoctorWelcomeEmail(email, name, licenseNumber)
      .then(result => {
        if (result.success) {
          console.log(`✅ Doctor welcome email sent to Dr. ${name}`);
        } else {
          console.warn(`⚠️ Doctor welcome email failed:`, result.error);
        }
      })
      .catch(error => {
        console.error(`❌ Unexpected error sending doctor welcome email:`, error);
      });

    const token = jwt.sign({
      id: doctor._id,
      role: 'doctor',
      email: doctor.email
    }, process.env.JWT_SECRET, { expiresIn: "7d" });

    const doctorResponse = {
      id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      phoneNumber: doctor.phoneNumber,
      specialization: doctor.specialization,
      licenseNumber: doctor.licenseNumber,
      hospital: doctor.hospital,
      qualifications: doctor.qualifications,
      yearsOfExperience: doctor.yearsOfExperience,
      role: doctor.role,
      isActive: doctor.isActive,
      isVerified: doctor.isVerified,
      lastLogin: doctor.lastLogin,
      fullTitle: getDoctorFullTitle(doctor),
      experienceLevel: getDoctorExperienceLevel(doctor),
      settings: doctor.settings,
      createdAt: doctor.createdAt,
      updatedAt: doctor.updatedAt
    };

    res.status(201).json({
      success: true,
      msg: "Doctor registration successful! You are now the primary doctor for DeepTB system.",
      token,
      doctor: doctorResponse
    });

  } catch (err) {
    console.error('Doctor signup error:', err);

    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      const value = err.keyValue[field];
      return res.status(400).json({
        success: false,
        msg: `${field === 'email' ? 'Email' : 'License number'} '${value}' is already registered`
      });
    }

    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

export const doctorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        msg: "Email and password are required"
      });
    }

    const doctor = await Doctor.findOne({ email }).select('+password');
    if (!doctor) return res.status(404).json({
      success: false,
      msg: "Doctor not found"
    });

    if (!doctor.isActive) {
      return res.status(403).json({
        success: false,
        msg: "Doctor account is deactivated. Please contact administrator."
      });
    }

    const valid = await bcrypt.compare(password, doctor.password);
    if (!valid) return res.status(401).json({
      success: false,
      msg: "Invalid credentials"
    });

    await updateDoctorLastLogin(doctor._id);

    const token = jwt.sign({
      id: doctor._id,
      role: 'doctor',
      email: doctor.email
    }, process.env.JWT_SECRET, { expiresIn: "7d" });

    const doctorResponse = {
      id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      phoneNumber: doctor.phoneNumber,
      specialization: doctor.specialization,
      licenseNumber: doctor.licenseNumber,
      hospital: doctor.hospital,
      qualifications: doctor.qualifications,
      yearsOfExperience: doctor.yearsOfExperience,
      role: doctor.role,
      isActive: doctor.isActive,
      isVerified: doctor.isVerified,
      lastLogin: new Date(),
      fullTitle: getDoctorFullTitle(doctor),
      experienceLevel: getDoctorExperienceLevel(doctor),
      settings: doctor.settings,
      createdAt: doctor.createdAt,
      updatedAt: doctor.updatedAt
    };

    const loginTime = new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    sendLoginNotification(email, doctor.name, loginTime, true)
      .then(result => {
        if (result.success) {
          console.log(`✅ Login notification sent to Dr. ${doctor.name}`);
        } else {
          console.warn(`⚠️ Login notification failed for Dr. ${doctor.name}:`, result.error);
        }
      })
      .catch(error => {
        console.error(`❌ Unexpected error sending login notification to Dr. ${doctor.name}:`, error);
      });

    res.json({
      success: true,
      token,
      doctor: doctorResponse
    });

  } catch (err) {
    console.error('Doctor login error:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

export const getDoctorProfile = async (req, res) => {
  try {
    const doctor = req.doctor;
    if (!doctor) {
      return res.status(404).json({
        success: false,
        msg: "Doctor not found"
      });
    }

    const doctorResponse = {
      id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      phoneNumber: doctor.phoneNumber,
      specialization: doctor.specialization,
      licenseNumber: doctor.licenseNumber,
      hospital: doctor.hospital,
      qualifications: doctor.qualifications,
      yearsOfExperience: doctor.yearsOfExperience,
      role: doctor.role,
      isActive: doctor.isActive,
      isVerified: doctor.isVerified,
      lastLogin: doctor.lastLogin,
      fullTitle: getDoctorFullTitle(doctor),
      experienceLevel: getDoctorExperienceLevel(doctor),
      settings: doctor.settings,
      profileImage: doctor.profileImage,
      signature: doctor.signature,
      createdAt: doctor.createdAt,
      updatedAt: doctor.updatedAt
    };

    res.json({
      success: true,
      doctor: doctorResponse
    });
  } catch (err) {
    console.error('Get doctor profile error:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

export const updateDoctorProfile = async (req, res) => {
  try {
    const { name, phoneNumber, hospital, qualifications, settings } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (hospital) updateData.hospital = hospital;
    if (qualifications) updateData.qualifications = qualifications;
    if (settings) updateData.settings = { ...req.doctor.settings, ...settings };

    const doctor = await Doctor.findByIdAndUpdate(
      req.doctor._id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        msg: "Doctor not found"
      });
    }

    const doctorResponse = {
      id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      phoneNumber: doctor.phoneNumber,
      specialization: doctor.specialization,
      licenseNumber: doctor.licenseNumber,
      hospital: doctor.hospital,
      qualifications: doctor.qualifications,
      yearsOfExperience: doctor.yearsOfExperience,
      role: doctor.role,
      isActive: doctor.isActive,
      isVerified: doctor.isVerified,
      lastLogin: doctor.lastLogin,
      fullTitle: getDoctorFullTitle(doctor),
      experienceLevel: getDoctorExperienceLevel(doctor),
      settings: doctor.settings,
      profileImage: doctor.profileImage,
      signature: doctor.signature,
      createdAt: doctor.createdAt,
      updatedAt: doctor.updatedAt
    };

    res.json({
      success: true,
      msg: "Profile updated successfully",
      doctor: doctorResponse
    });

  } catch (err) {
    console.error('Update doctor profile error:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
