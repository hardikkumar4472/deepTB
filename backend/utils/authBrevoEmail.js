import { sendBrevoEmail } from './brevoEmail.js';

export const sendWelcomeEmail = async (email, name) => {
  try {
    const subject = 'Welcome to DeepTB!';
    const text = `
Welcome to DeepTB, ${name}!

Thank you for joining our healthcare platform. We're excited to have you on board.

With DeepTB, you can:
- Upload and analyze medical images
- Get instant AI-powered diagnoses
- Store and manage your medical reports
- Access your health data securely

If you have any questions, feel free to contact our support team.

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
        .features { margin: 20px 0; }
        .feature-item { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #667eea; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to DeepTB!</h1>
        </div>
        <div class="content">
            <h2>Hello ${name},</h2>
            <p>Thank you for joining our healthcare platform. We're excited to have you on board.</p>
            
            <div class="features">
                <h3>What you can do with DeepTB:</h3>
                <div class="feature-item">
                    <strong>📁 Upload Medical Images</strong>
                    <p>Securely upload your X-rays and medical images for analysis</p>
                </div>
                <div class="feature-item">
                    <strong>🤖 AI-Powered Diagnosis</strong>
                    <p>Get instant AI analysis of your medical images</p>
                </div>
                <div class="feature-item">
                    <strong>💾 Secure Storage</strong>
                    <p>Store and manage all your medical reports in one place</p>
                </div>
                <div class="feature-item">
                    <strong>🔒 Data Security</strong>
                    <p>Your health data is protected with enterprise-grade security</p>
                </div>
            </div>
            
            <p>If you have any questions, feel free to contact our support team.</p>
            
            <p>Best regards,<br>DeepTB Team</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 DeepTB. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;

    console.log(`📧 Sending welcome email to: ${email}`);

    const result = await sendBrevoEmail({
      to: email,
      subject,
      text,
      htmlContent

    });

    return result;
  } catch (error) {
    console.error('❌ Welcome email error:', error);
    return { success: false, error: error.message };
  }
};

export const sendLoginNotification = async (email, name, loginTime) => {
  try {
    const subject = 'New Login Detected - DeepTB';
    const text = `
Hello ${name},

We detected a new login to your DeepTB account.

Login Time: ${loginTime}

If this was you, you can safely ignore this email.

If you don't recognize this activity, please contact our support team immediately.

Best regards,
DeepTB Security Team
    `;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .login-info { background: white; padding: 20px; border-radius: 8px; border: 2px solid #ff6b6b; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Security Notification</h1>
        </div>
        <div class="content">
            <h2>Hello ${name},</h2>
            <p>We detected a new login to your DeepTB account.</p>
            
            <div class="login-info">
                <h3>Login Details:</h3>
                <p><strong>Time:</strong> ${loginTime}</p>
                <p><strong>Account:</strong> ${email}</p>
            </div>
            
            <p><strong>If this was you:</strong> You can safely ignore this email.</p>
            <p><strong>If you don't recognize this activity:</strong> Please contact our support team immediately to secure your account.</p>
            
            <p>Best regards,<br>DeepTB Security Team</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 DeepTB. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;

    console.log(`📧 Sending login notification to: ${email}`);

    const result = await sendBrevoEmail({
      to: email,
      subject,
      text,
      htmlContent

    });

    return result;
  } catch (error) {
    console.error('❌ Login notification email error:', error);
    return { success: false, error: error.message };
  }
};