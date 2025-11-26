import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "tb_user" }, 
  imageUrl: String,
  label: String,
  confidence: Number,
  raw_prediction: Number,   
  threshold_used: Number,   
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Result", resultSchema);
