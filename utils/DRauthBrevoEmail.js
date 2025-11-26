import dotenv from "dotenv";
import brevo from 'sib-api-v3-sdk';

dotenv.config();

const defaultClient = brevo.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new brevo.TransactionalEmailsApi();

export const sendDoctorWelcomeEmail = async (doctorEmail, doctorName, licenseNumber) => {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.sender = {
      name: "DeepTB Admin",
      email: process.env.FROM_EMAIL || "admin@deeptb.com"
    };

    sendSmtpEmail.to = [
      {
        email: doctorEmail,
        name: `Dr. ${doctorName}`
      }
    ];

    sendSmtpEmail.subject = "Welcome to DeepTB - Doctor Portal Access";
    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background: #2c5aa0; color: white; padding: 30px 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .doctor-info { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2c5aa0; }
          .privileges { background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { margin-top: 25px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">Doctor Portal Access Granted</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">DeepTB AI Diagnostic System</p>
          </div>
          <div class="content">
            <p>Dear <strong>Dr. ${doctorName}</strong>,</p>

            <p>Welcome to the DeepTB Doctor Portal! You have been successfully registered as the primary medical professional for our AI-powered tuberculosis detection system.</p>

            <div class="doctor-info">
              <h3 style="color: #2c5aa0; margin-top: 0;">Your Registration Details:</h3>
              <p><strong>Name:</strong> Dr. ${doctorName}</p>
              <p><strong>License Number:</strong> ${licenseNumber}</p>
              <p><strong>Role:</strong> Primary Doctor</p>
              <p><strong>Status:</strong> Active</p>
            </div>

            <div class="privileges">
              <h4 style="color: #2e7d32; margin-top: 0;">Your Doctor Privileges:</h4>
              <ul>
                <li>Review and validate AI-generated TB detection reports</li>
                <li>Provide medical notes and recommendations</li>
                <li>Access patient medical history and X-ray images</li>
                <li>Generate comprehensive medical reports</li>
                <li>Monitor system performance and accuracy</li>
              </ul>
            </div>

            <p>You can now access the doctor dashboard to start reviewing patient cases and providing your expert medical validation.</p>

            <div style="text-align: center; margin: 25px 0;">
              <a href="${process.env.FRONTEND_URL || 'https://your-deeptb-app.vercel.app'}/doctor/dashboard"
                  style="display: inline-block; background: #2c5aa0; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Access Doctor Dashboard
              </a>
            </div>

            <div class="footer">
              <p><strong>Medical Responsibility:</strong> As the primary doctor, you are responsible for validating all AI-generated reports and ensuring accurate medical assessments.</p>
              <p>For technical support or questions about the platform, contact: <a href="mailto:support@deeptb.com">support@deeptb.com</a></p>
              <p>Best regards,<br><strong>DeepTB Administration Team</strong></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    sendSmtpEmail.replyTo = {
      email: "hrhrrrana@gmail.com",
      name: "DeepTB Admin"
    };

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Doctor welcome email sent to:', doctorEmail);
    return { success: true, messageId: data.messageId };

  } catch (error) {
    console.error('❌ Error sending doctor welcome email:', error.message);
    return { success: false, error: error.message };
  }
};

export const sendPatientWelcomeEmail = async (userEmail, userName) => {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.sender = {
      name: "DeepTB AI Diagnostic",
      email: process.env.FROM_EMAIL || "no-reply@deeptb.com"
    };

    sendSmtpEmail.to = [
      {
        email: userEmail,
        name: userName
      }
    ];

    sendSmtpEmail.subject = "Welcome to DeepTB - Your Tuberculosis Detection Platform";
    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background: #2c5aa0; color: white; padding: 30px 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .welcome-text { font-size: 16px; margin-bottom: 20px; }
          .features { margin: 25px 0; }
          .feature-item { margin: 12px 0; padding-left: 20px; position: relative; }
          .feature-item:before { content: "✓"; position: absolute; left: 0; color: #2c5aa0; font-weight: bold; }
          .footer { margin-top: 25px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          .cta-button { display: inline-block; background: #2c5aa0; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .security-note { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">Welcome to DeepTB</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">AI-Powered Tuberculosis Detection</p>
          </div>
          <div class="content">
            <p class="welcome-text">Dear <strong>${userName}</strong>,</p>

            <p>Welcome to DeepTB! We're excited to have you on board as part of our mission to make tuberculosis detection more accessible and accurate using artificial intelligence.</p>

            <div class="features">
              <h3 style="color: #2c5aa0;">What you can do with DeepTB:</h3>
              <div class="feature-item">Upload chest X-ray images for AI analysis</div>
              <div class="feature-item">Get instant TB detection results</div>
              <div class="feature-item">Receive detailed medical reports</div>
              <div class="feature-item">Track your health history</div>
              <div class="feature-item">Consult with healthcare professionals</div>
            </div>

            <p>Your account has been successfully created and you can now start using our platform to get AI-powered TB detection services.</p>

            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'https://your-deeptb-app.vercel.app'}" class="cta-button">Get Started Now</a>
            </div>

            <div class="security-note">
              <strong>🔒 Account Security:</strong> Your privacy and security are important to us. We use advanced encryption to protect your medical data.
            </div>

            <div class="footer">
              <p>If you have any questions, please don't hesitate to contact our support team at <a href="mailto:support@deeptb.com">support@deeptb.com</a>.</p>
              <p>Best regards,<br><strong>The DeepTB Team</strong></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    sendSmtpEmail.replyTo = {
      email: "support@deeptb.com",
      name: "DeepTB Support"
    };

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Patient welcome email sent to:', userEmail);
    return { success: true, messageId: data.messageId };

  } catch (error) {
    console.error('❌ Error sending patient welcome email:', error.message);
    return { success: false, error: error.message };
  }
};

export const sendLoginNotification = async (userEmail, userName, loginTime, isDoctor = false) => {
  try {
    const userType = isDoctor ? "Doctor" : "User";
    const title = isDoctor ? `Dr. ${userName}` : userName;

    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.sender = {
      name: "DeepTB Security",
      email: process.env.FROM_EMAIL || "security@deeptb.com"
    };

    sendSmtpEmail.to = [
      {
        email: userEmail,
        name: title
      }
    ];

    sendSmtpEmail.subject = "Security Alert: New Login to Your DeepTB Account";
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="background: #2c5aa0; color: white; padding: 25px; text-align: center;">
          <h2 style="margin: 0;">DeepTB Security Notification</h2>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <p style="font-size: 16px;">Hello <strong>${title}</strong>,</p>
          <p>We noticed a recent login to your DeepTB ${userType.toLowerCase()} account. Here are the details:</p>

          <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #2c5aa0; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <p style="margin: 8px 0;"><strong>👤 Account:</strong> ${userEmail}</p>
            <p style="margin: 8px 0;"><strong>🕒 Login Time:</strong> ${loginTime}</p>
            <p style="margin: 8px 0;"><strong>👥 User Type:</strong> ${userType}</p>
            <p style="margin: 8px 0;"><strong>🌐 Location:</strong> Detected from your IP address</p>
          </div>

          <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
            <p>This is an automated security message from DeepTB to help protect your account.</p>
            <p>For security reasons, we recommend:</p>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Use a strong, unique password</li>
              <li>Enable two-factor authentication if available</li>
              <li>Never share your login credentials</li>
              <li>Regularly monitor your account activity</li>
            </ul>
          </div>
        </div>
      </div>
    `;

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ Login notification sent to ${userType}:`, userEmail);
    return { success: true, messageId: data.messageId };

  } catch (error) {
    console.error('❌ Error sending login notification:', error.message);
    return { success: false, error: error.message };
  }
};

export const sendReportReadyEmail = async (userEmail, userName, reportId, isDoctorGenerated = false) => {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.sender = {
      name: "DeepTB Reports",
      email: process.env.FROM_EMAIL || "reports@deeptb.com"
    };

    sendSmtpEmail.to = [
      {
        email: userEmail,
        name: userName
      }
    ];

    const reportType = isDoctorGenerated ? "Doctor Reviewed" : "AI Generated";

    sendSmtpEmail.subject = `Your TB Detection Report is Ready - ${reportType}`;
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="background: #2c5aa0; color: white; padding: 25px; text-align: center;">
          <h2 style="margin: 0;">TB Detection Report Ready</h2>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Report ID: ${reportId}</p>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <p style="font-size: 16px;">Dear <strong>${userName}</strong>,</p>

          <p>Your tuberculosis detection report has been processed and is now available for review.</p>

          <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #2c5aa0;">
            <h4 style="color: #2c5aa0; margin-top: 0;">Report Details:</h4>
            <p><strong>Report ID:</strong> ${reportId}</p>
            <p><strong>Report Type:</strong> ${reportType}</p>
            <p><strong>Generated On:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Status:</strong> Ready for Review</p>
          </div>

          <p>The report includes AI analysis of your chest X-ray images along with detailed findings and recommendations.</p>

          <div style="text-align: center; margin: 25px 0;">
            <a href="${process.env.FRONTEND_URL || 'https://your-deeptb-app.vercel.app'}/reports/${reportId}"
               style="display: inline-block; background: #2c5aa0; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              View Your Report
            </a>
          </div>

          <div style="background: #e3f2fd; border: 1px solid #2196F3; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #1565c0;">
              <strong>📋 Next Steps:</strong>
              ${isDoctorGenerated
                ? "Your report has been reviewed by our medical professional. Please follow the recommendations provided."
                : "Your report has been generated by our AI system and is awaiting medical professional review."}
            </p>
          </div>

          <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
            <p><strong>Medical Disclaimer:</strong> This report is generated for informational purposes and should be reviewed by a qualified healthcare professional for accurate diagnosis.</p>
            <p>For questions about your report, contact: <a href="mailto:support@deeptb.com">support@deeptb.com</a></p>
          </div>
        </div>
      </div>
    `;

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Report ready email sent to:', userEmail);
    return { success: true, messageId: data.messageId };

  } catch (error) {
    console.error('❌ Error sending report ready email:', error.message);
    return { success: false, error: error.message };
  }
};

export const sendWelcomeEmail = async (userEmail, userName, isDoctor = false, licenseNumber = null) => {
  if (isDoctor) {
    return await sendDoctorWelcomeEmail(userEmail, userName, licenseNumber || "Provided during registration");
  } else {
    return await sendPatientWelcomeEmail(userEmail, userName);
  }
};

export const sendGeneralEmail = async ({ to, subject, htmlContent, attachments = [] }) => {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.sender = {
      name: "DeepTB System",
      email: process.env.FROM_EMAIL || "no-reply@deeptb.com"
    };

    sendSmtpEmail.to = Array.isArray(to)
      ? to.map(email => ({ email }))
      : [{ email: to }];

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;

    if (attachments && attachments.length > 0) {
      sendSmtpEmail.attachment = attachments;
    }

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ General email sent successfully:', subject);
    return { success: true, messageId: data.messageId };

  } catch (error) {
    console.error('❌ Error sending general email:', error.message);
    return { success: false, error: error.message };
  }
};

export default {
  sendDoctorWelcomeEmail,
  sendPatientWelcomeEmail,
  sendWelcomeEmail,
  sendLoginNotification,
  sendReportReadyEmail,
  sendGeneralEmail
};