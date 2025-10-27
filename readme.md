DeepTB - Tuberculosis Detection System
https://img.shields.io/badge/DeepTB-TB%2520Detection%2520System-blue
https://img.shields.io/badge/version-1.0.0-green
https://img.shields.io/badge/license-MIT-lightgrey

A comprehensive tuberculosis detection system that leverages AI to analyze chest X-rays and provide instant TB screening with detailed reports and analytics.

🚀 Features
🔬 AI-Powered Detection
Fine-tuned DenseNet121 model for accurate TB detection
Severity analysis with confidence scores
Real-time predictions via FastAPI microservice

👥 User Management
Secure JWT authentication with 2FA
Role-based access (Patients, Doctors)
Email verification and OTP-based login
Profile management and history tracking

📊 Medical Workflow
X-ray upload with secure storage
AI analysis with instant results
Doctor review and manual approval
PDF report generation
Patient progress tracking

📈 Analytics & Insights
TB case trends and statistics
Model performance metrics
Geographic hotspot mapping
Sending generated report on Email 


🛠 Tech Stack
Frontend
React - UI framework
Vercel - static hosting

Backend
Node.js + Express 
Render, Vercel, Hugging Face
JWT - Authentication
bcrypt - Password hashing

Database & Storage
MongoDB Atlas 
Supabase 
Field-level encryption - Data security

Machine Learning
TensorFlow/Keras - Model training
FastAPI - ML microservice
Render - Free inference hosting

Services
Brevo (SendinBlue) 
ReportLab - PDF generation

🚀 Quick Start
Prerequisites
Node.js 16+
Python 3.8+
MongoDB Atlas account
Supabase account

🎯 Usage
For Patients
Register/Login with email verification
Upload chest X-ray through secure portal
Receive AI analysis within Seconds
Get doctor-reviewed report via email
Track progress in personal dashboard

For Doctors
Review AI predictions in dashboard
Approve/reject AI findings
Add manual notes and signatures
Generate comprehensive reports
Monitor patient cases
Sending report on patient registered Gmail

🧠 Machine Learning
Model Architecture
Base Model: DenseNet121
Input Size: 224x224 pixels
Output: Binary classification (TB/Normal)
Confidence Score: 0-100%
Training Data
Source: Kaggle Tuberculosis Chest X-ray Database
Samples: 700+ annotated X-rays

Validation: 5-fold cross-validation
Augmentation: Rotation, zoom, flip
Performance Metrics
Accuracy: 96.2%
Precision: 95.8%
Recall: 96.5%
F1-Score: 96.1%

🛡 Security
Data Protection
JWT tokens for session management
bcrypt hashing for passwords
2FA via email OTP
Rate limiting on authentication endpoints
Helmet.js for secure headers
Privacy Compliance
Encrypted database fields for sensitive data
Secure file storage with access controls
Audit logs for all medical actions

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
Kaggle for the TB Chest X-ray Dataset
TensorFlow team for ML frameworks
Render & Vercel for free hosting
Brevo for email services

📞 Support
For support and questions:

📧 Email: hardikv715@gmail.com
🐛 Issues: GitHub Issues page
📚 Docs: Comprehensive documentation

Built with ❤️ for global healthcare accessibility
