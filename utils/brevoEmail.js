import dotenv from "dotenv";
import brevo from 'sib-api-v3-sdk';
import https from 'https';
import fs from "fs";

dotenv.config();


const defaultClient = brevo.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new brevo.TransactionalEmailsApi();


const downloadFileFromUrl = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download file: ${response.statusCode}`));
        return;
      }
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    });
  });
};


export const sendBrevoEmail = async ({ to, subject, text, htmlContent, attachments }) => {
  try {

    let formattedAttachments = [];
    
    if (attachments && Array.isArray(attachments) && attachments.length > 0) {
      formattedAttachments = await Promise.all(
        attachments.map(async (file) => {
          let fileData;
          if (file.path.startsWith('http')) {
            fileData = await downloadFileFromUrl(file.path);
          } else {
            fileData = await fs.promises.readFile(file.path);
          }
          return {
            name: file.filename,
            content: fileData.toString("base64"),
          };
        })
      );
    }

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.sender = {
      name: "DeepTB",
      email: process.env.FROM_EMAIL,
    };
    sendSmtpEmail.to = Array.isArray(to)
      ? to.map((email) => ({ email }))
      : [{ email: to }];
    sendSmtpEmail.subject = subject;
    
    if (htmlContent) {
      sendSmtpEmail.htmlContent = htmlContent;
    } else {
      sendSmtpEmail.textContent = text;
    }
    

    if (formattedAttachments.length > 0) {
      sendSmtpEmail.attachment = formattedAttachments;
    }

    console.log('📧 Sending email via Brevo:', {
      to: sendSmtpEmail.to,
      subject: sendSmtpEmail.subject,
      hasHtml: !!sendSmtpEmail.htmlContent,
      hasText: !!sendSmtpEmail.textContent,
      attachmentsCount: formattedAttachments.length
    });

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Email sent successfully:', response);
    return { success: true, response };
  } catch (err) {
    console.error("❌ Email sending error:", err);
    console.error("Error details:", {
      status: err.status,
      code: err.code,
      message: err.message,
      response: err.response?.body
    });
    return { success: false, error: err.message };
  }
};


export const sendMail = sendBrevoEmail;