import mongoose from "mongoose";

const tb_user = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  phoneNumber: { type: String, required: true },
  emailVerified: { type: Boolean, default: false },
  verificationToken: { type: String }
}, { timestamps: true, collection: 'tb_users' });

export default mongoose.model("tb_user", tb_user);