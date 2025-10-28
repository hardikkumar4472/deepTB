import { sendBrevoEmail } from './brevoEmail.js';

export const sendOTPEmail = async (email, otp, name) => {
  try {
    const subject = 'Verify Your Email - DeepTB';
    const text = `
Hello ${name},

Thank you for registering with DeepTB!

Your One-Time Password (OTP) for email verification is: ${otp}

This OTP will expire in 5 minutes.

If you didn't request this verification, please ignore this email.

Best regards,
DeepTB Team
    `;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-code { font-size: 32px; font-weight: bold; text-align: center; color: #667eea; margin: 20px 0; padding: 15px; background: white; border-radius: 8px; letter-spacing: 5px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Email Verification</h1>
        </div>
        <div class="content">
            <h2>Hello ${name},</h2>
            <p>Thank you for registering with DeepTB! To complete your registration, please use the following One-Time Password (OTP) to verify your email address:</p>
            
            <div class="otp-code">${otp}</div>
            
            <p><strong>This OTP will expire in 5 minutes.</strong></p>
            
            <p>If you didn't request this verification, please ignore this email.</p>
            
            <p>Best regards,<br>DeepTB</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 DeepTB. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;

    console.log(`📧 Sending OTP email to: ${email}, OTP: ${otp}`);

    const result = await sendBrevoEmail({
      to: email,
      subject,
      text,
      htmlContent

    });

    return result;
  } catch (error) {
    console.error('❌ OTP email error:', error);
    return { success: false, error: error.message };
  }
};