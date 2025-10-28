import Report from "../models/reportSchema.js";
import tb_user from "../models/tb_users.js";
import result from "../models/result.js";
import { generateReportPDF } from "../utils/pdfGenerator.js";
import { sendMail } from "../utils/brevoEmail.js";
import fs from "fs";
import path from "path";

export const createReport = async (req, res) => {
  try {
    const { patientId, doctorNotes = "", consultationPaid = false, resultId } = req.body;

    if (!patientId || !patientId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, error: "Invalid patientId" });
    }

    const patient = await tb_user.findById(patientId);
    if (!patient) return res.status(404).json({ success: false, error: "Patient not found" });

    let latestResult;

    if (resultId) {
      latestResult = await result.findById(resultId);
      if (!latestResult) {
        return res.status(404).json({ success: false, error: "Specified result not found" });
      }
      if (latestResult.userId.toString() !== patientId) {
        return res.status(400).json({ success: false, error: "Result does not belong to this patient" });
      }
    } else {
      latestResult = await result.findOne({ userId: patientId }).sort({ createdAt: -1 });
      if (!latestResult) {
        return res.status(404).json({ success: false, error: "No AI results found for this patient" });
      }
    }

    const reportsDir = path.join(process.cwd(), "reports");
    if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir);

    const pdfName = `report_${Date.now()}.pdf`;
    const outputPath = path.join(reportsDir, pdfName);

    await generateReportPDF({
      outputPath,
      patientId: patient._id.toString(),
      patientName: patient.name,
      patientEmail: patient.email,
      patientAge: patient.age,
      patientGender: patient.gender,
      patientPhone: patient.phoneNumber,
      xrayUrl: latestResult.imageUrl,
      label: latestResult.label,
      raw_prediction: latestResult.raw_prediction,
      heatmapUrl: latestResult.heatmapUrl,
      doctorNotes,
    });

    const newReport = new Report({
      patientId,
      patientName: patient.name,
      patientEmail: patient.email,
      xrayUrl: latestResult.imageUrl,
      label: latestResult.label,
      raw_prediction: latestResult.raw_prediction,
      heatmapUrl: latestResult.heatmapUrl,
      doctorNotes,
      pdfUrl: outputPath,
      status: consultationPaid ? "pending_doctor" : "free_generated",
      originalResultId: latestResult._id
    });

    await newReport.save();

    try {
      await result.findByIdAndDelete(latestResult._id);
      console.log(`✅ Successfully deleted result ${latestResult._id} after report creation`);
    } catch (deleteError) {
      console.error(`❌ Failed to delete result ${latestResult._id}:`, deleteError);
    }

    if (!consultationPaid) {
      await sendMail({
        to: patient.email,
        subject: "Your TB Detection Report",
        text: `Hi ${patient.name}, your TB report is ready.`,
        attachments: [{ path: outputPath, filename: pdfName }],
      });
    }

    res.status(201).json({
      success: true,
      report: newReport,
      deletedResultId: latestResult._id,
      message: "Report generated successfully and original result deleted"
    });
  } catch (err) {
    console.error("Create report error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};


export const getPendingReports = async (req, res) => {
  try {
    const reports = await Report.find({ status: "pending_doctor" });
    res.json({ success: true, reports });
  } catch (err) {
    console.error("Get pending reports error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const reviewReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { approve, doctorNotes = "" } = req.body;

    const report = await Report.findById(reportId);
    if (!report) return res.status(404).json({ success: false, message: "Report not found" });

    report.status = approve ? "approved" : "rejected";
    report.doctorNotes = doctorNotes || report.doctorNotes;

    await report.save();

    await sendMail({
      to: report.patientEmail,
      subject: `Your TB Report has been ${approve ? "Approved" : "Rejected"}`,
      text: `Hi ${report.patientName}, your TB report has been reviewed by the doctor.`,
      attachments: [{ path: report.pdfUrl, filename: path.basename(report.pdfUrl) }],
    });

    res.json({ success: true, report });
  } catch (err) {
    console.error("Review report error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const report = await Report.findById(reportId);
    if (!report) return res.status(404).json({ success: false, message: "Report not found" });

    res.json({ success: true, report });
  } catch (err) {
    console.error("Get report error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
export const getReportCount = async (req, res) => {
  try {
    const totalReports = await Report.countDocuments();
    res.json({ success: true, totalReports });
  } catch (err) {
    console.error("Get report count error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
export const getApprovedReports = async (req, res) => {
  try {
    const reports = await Report.find({ status: "approved" }).sort({ createdAt: -1 });

    res.json({
      success: true,
      reports,
      count: reports.length,
      message: `Found ${reports.length} approved reports`
    });
  } catch (err) {
    console.error("Get approved reports error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getRejectedReports = async (req, res) => {
  try {
    const reports = await Report.find({ status: "rejected" }).sort({ createdAt: -1 });

    res.json({
      success: true,
      reports,
      count: reports.length,
      message: `Found ${reports.length} rejected reports`
    });
  } catch (err) {
    console.error("Get rejected reports error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};