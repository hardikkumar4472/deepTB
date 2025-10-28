
import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tb_user",
      required: true,
    },
    patientName: { type: String, required: true },
    patientEmail: { type: String, required: true },
    xrayUrl: { type: String, required: true },
    label: { type: String, required: true },
    raw_prediction: { type: Number, required: true },
    heatmapUrl: { type: String },
    doctorNotes: { type: String, default: "" },
    pdfUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ["free_generated", "pending_doctor", "approved", "rejected"],
      default: "pending_doctor",
    },
    originalResultId: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "Result"
    }
  },
  { timestamps: true }
);

export default mongoose.model("report", reportSchema);