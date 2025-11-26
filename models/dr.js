import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Doctor name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters long"],
    maxlength: [100, "Name cannot exceed 100 characters"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
    match: [/^\+?[\d\s-()]{10,}$/, "Please enter a valid phone number"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"]
  },
  licenseNumber: {
    type: String,
    required: [true, "Medical license number is required"],
    unique: true,
    trim: true,
    uppercase: true
  },
  specialization: {
    type: String,
    required: [true, "Specialization is required"],
    trim: true,
    enum: {
      values: [
        "Radiology",
        "Pulmonology",
        "Infectious Diseases",
        "General Medicine",
        "Tuberculosis Specialist",
        "Chest Physician",
        "Other"
      ],
      message: "Please select a valid specialization"
    }
  },
  hospital: {
    type: String,
    required: [true, "Hospital/Clinic name is required"],
    trim: true,
    maxlength: [200, "Hospital name cannot exceed 200 characters"]
  },
  qualifications: {
    type: [String],
    default: [],
    validate: {
      validator: function(quals) {
        return quals.length <= 10;
      },
      message: "Cannot have more than 10 qualifications"
    }
  },
  yearsOfExperience: {
    type: Number,
    required: [true, "Years of experience is required"],
    min: [0, "Experience cannot be negative"],
    max: [60, "Experience cannot exceed 60 years"]
  },
  role: {
    type: String,
    default: "head_doctor",
    enum: ["head_doctor"],
    immutable: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDate: {
    type: Date,
    default: null
  },
  lastLogin: {
    type: Date,
    default: null
  },
  profileImage: {
    type: String,
    default: null
  },
  signature: {
    type: String,
    default: "HARSHIT RANA"
  },
  settings: {
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    autoLogout: { type: Number, default: 60 },
    language: { type: String, default: "en" },
    theme: { type: String, default: "light" }
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  },
  toObject: {
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  }
});

export default mongoose.model("Doctor", doctorSchema);