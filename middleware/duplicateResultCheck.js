import Result from "../models/result.js";

export const checkDuplicateResult = async (req, res, next) => {
  try {
    const userId = req.user.id; 
    const existingResult = await Result.findOne({ 
      userId: userId
    });

    if (existingResult) {
      return res.status(429).json({
        success: false,
        error: "You already have a test result in the system. Please wait for doctor review or contact support.",
        existingResultId: existingResult._id
      });
    }

    next();
  } catch (error) {
    console.error('Duplicate result check error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error during duplicate check' 
    });
  }
};