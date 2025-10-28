import { sendOTPEmail } from './otpEmail.js';
import { sendWelcomeEmail, sendLoginNotification } from './authBrevoEmail.js';

export const EmailService = {
  sendOTP: sendOTPEmail,
  sendWelcome: sendWelcomeEmail,
  sendLoginNotification: sendLoginNotification,
};