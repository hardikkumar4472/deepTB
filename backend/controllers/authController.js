import tb_user from "../models/tb_users.js";
import OTP from "../models/otp.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { EmailService } from "../utils/emailService.js";
import { generateOTP, isOTPExpired } from "../utils/otpGenerator.js";
export const sendOTP = async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, msg: "Email is required" });
    }
    const existingUser = await tb_user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        msg: "User already exists with this email"
      });
    }

    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await OTP.deleteMany({ email });
    const otpRecord = new OTP({
      email,
      otp: otpCode,
      expiresAt
    });

    await otpRecord.save();
    const emailResult = await EmailService.sendOTP(email, otpCode, name || 'User');

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        msg: "Failed to send OTP email"
      });
    }

    res.json({
      success: true,
      msg: "OTP sent successfully",
      email: email
    });

  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp: otpCode, name, password, age, gender, phoneNumber } = req.body;
    if (!otpCode) {
      return res.status(400).json({
        success: false,
        msg: "All fields are required"
      });
    }


    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        msg: "OTP not found or expired. Please request a new OTP."
      });
    }


    if (isOTPExpired(otpRecord.expiresAt)) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        msg: "OTP has expired. Please request a new OTP."
      });
    }

    if (otpRecord.verified) {
      return res.status(400).json({
        success: false,
        msg: "OTP already used. Please request a new OTP."
      });
    }

    if (otpRecord.attempts >= 5) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        msg: "Too many failed attempts. Please request a new OTP."
      });
    }


    if (otpRecord.otp !== otpCode) {
      otpRecord.attempts += 1;
      await otpRecord.save();

      const remainingAttempts = 5 - otpRecord.attempts;
      return res.status(400).json({
        success: false,
        msg: `Invalid OTP. ${remainingAttempts} attempts remaining.`
      });
    }

    otpRecord.verified = true;
    await otpRecord.save();


    const existingUser = await tb_user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        msg: "User already exists"
      });
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    const user = new tb_user({
      name,
      email,
      password: hashedPassword,
      age,
      gender,
      phoneNumber,
      emailVerified: true
    });

    await user.save();


    await OTP.deleteOne({ _id: otpRecord._id });


    EmailService.sendWelcome(email, name)
      .then(result => {
        if (result.success) {
          console.log(`Welcome email sent to ${email}`);
        } else {
          console.warn(`Welcome email failed for ${email}:`, result.error);
        }
      })
      .catch(error => {
        console.error(`Unexpected error sending welcome email to ${email}:`, error);
      });


    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      success: true,
      msg: "Registration successful! Email verified.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        phoneNumber: user.phoneNumber,
        emailVerified: user.emailVerified
      }
    });

  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, age, gender, phoneNumber } = req.body;

    if (!name || !email || !password || !age || !gender || !phoneNumber) {
      return res.status(400).json({
        success: false,
        msg: "All fields are required"
      });
    }

    const existing = await tb_user.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        msg: "User already exists"
      });
    }

    const otpCode = generateOTP();

    const otpResult = await EmailService.sendOTP(email, otpCode, name);

    if (!otpResult.success) {
      return res.status(500).json({
        success: false,
        msg: "Failed to send OTP email"
      });
    }

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OTP.deleteMany({ email });

    const otpRecord = new OTP({
      email,
      otp: otpCode,
      expiresAt
    });
    await otpRecord.save();

    res.json({
      success: true,
      msg: "OTP sent to your email for verification",
      email: email,
      nextStep: "verify-otp"
    });

  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, msg: "Email and password are required" });
    }

    const user = await tb_user.findOne({ email });
    if (!user) return res.status(404).json({ success: false, msg: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ success: false, msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    const loginTime = new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    EmailService.sendLoginNotification(email, user.name, loginTime)
      .then(result => {
        if (result.success) {
          console.log(`✅ Login notification sent to ${email}`);
        } else {
          console.warn(`⚠️ Login notification failed for ${email}:`, result.error);
        }
      })
      .catch(error => {
        console.error(`❌ Unexpected error sending login notification to ${email}:`, error);
      });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        phoneNumber: user.phoneNumber
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    console.log("🔍 Full req.user object:", req.user);
    console.log("🔍 req.user type:", typeof req.user);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        msg: "Authentication middleware failed - req.user is undefined",
        instructions: "Check that: 1) Token is valid 2) Auth middleware is properly applied 3) Token is in Authorization header as 'Bearer <token>'"
      });
    }

    const userId = req.user.id || req.user._id || req.user.userId || req.user.sub;

    console.log("🔍 Extracted userId:", userId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        msg: "User ID not found in token",
        availableFields: Object.keys(req.user),
        tokenContents: req.user
      });
    }

    const user = await tb_user.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found in database",
        searchedId: userId
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        phoneNumber: user.phoneNumber,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};