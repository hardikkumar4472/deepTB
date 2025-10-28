
import tb_users from "../models/tb_users.js";
export const getAllPatients = async (req, res) => {
  try {
    const patients = await tb_users.find({}).select('-password');

    if (!patients || patients.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No patients found in the database"
      });
    }

    res.status(200).json({
      success: true,
      message: "Patients fetched successfully",
      count: patients.length,
      data: patients
    });

  } catch (error) {
    console.error("Get patients error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching patients",
      error: error.message
    });
  }
};


export const getPatientById = async (req, res) => {
  try {
    const patient = await tb_users.findById(req.params.id).select('-password');

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Patient fetched successfully",
      data: patient
    });

  } catch (error) {
    console.error("Get patient by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching patient",
      error: error.message
    });
  }
};
export const getPatientResults = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({ success: false, error: "Patient ID is required" });
    }

    const results = await result.find({ userId: patientId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      results
    });
  } catch (err) {
    console.error("Get patient results error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
export const getPatientHistory = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!patientId || !patientId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: "Invalid patient ID format"
      });
    }

    const patient = await tb_user.findById(patientId).select('-password');
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: "Patient not found"
      });
    }

    const reports = await Report.find({ patientId })
      .sort({ createdAt: -1 })
      .select('-pdfUrl');

    const stats = {
      totalReports: reports.length,
      pending: reports.filter(r => r.status === 'pending_doctor').length,
      approved: reports.filter(r => r.status === 'approved').length,
      rejected: reports.filter(r => r.status === 'rejected').length,
      freeGenerated: reports.filter(r => r.status === 'free_generated').length
    };

    res.status(200).json({
      success: true,
      message: `Patient history retrieved successfully`,
      patient: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        age: patient.age,
        gender: patient.gender,
        phoneNumber: patient.phoneNumber,
        createdAt: patient.createdAt,
        updatedAt: patient.updatedAt
      },
      reports,
      statistics: stats,
      reportCount: reports.length
    });

  } catch (err) {
    console.error("Get patient history error:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
