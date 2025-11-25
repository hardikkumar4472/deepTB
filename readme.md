Let's have a try: https://deeptb.onrender.com/

🩺 DeepTB - Tuberculosis Detection System

A comprehensive AI-powered tuberculosis detection system that analyzes chest X-rays to provide instant TB screening, severity analysis, and detailed medical reports — empowering doctors and patients with intelligent healthcare insights.

🚀 Features
🔬 AI-Powered Detection
Fine-tuned DenseNet121 deep learning model for high-accuracy TB detection

Confidence-based severity analysis

FastAPI microservice for real-time model inference

👥 User Management
Secure JWT Authentication with 2FA (Two-Factor Authentication)

Role-based access control for:

👨‍⚕️ Doctors

🧑‍🦰 Patients

Email verification & OTP-based login

User profile & medical history tracking

📊 Medical Workflow
Secure X-ray upload and encrypted storage

Instant AI analysis with visualization and prediction results

Doctor review and manual confirmation before finalizing diagnosis

Automated PDF report generation

Patient progress tracking over multiple visits

📈 Analytics & Insights
Interactive dashboard for:

TB case trends and demographics

Model accuracy and confidence metrics

Geographic hotspot mapping

Automated email delivery of medical reports to patients/doctors

🛠 Tech Stack
🖥️ Frontend
React.js – Modern UI framework

Tailwind CSS – Responsive design system

Vercel – Frontend hosting and deployment

⚙️ Backend
Node.js + Express – Core backend server

JWT – Authentication & authorization

bcrypt – Secure password hashing

Render / Vercel / Hugging Face – API & ML service deployment

🧠 Machine Learning
TensorFlow / Keras – Model training and optimization

FastAPI – ML inference microservice

Hosted on Render for free scalable deployment

🗄️ Database & Storage
MongoDB Atlas – Cloud database

Supabase – Secure media storage

Field-level encryption for sensitive medical data

📧 Services
Brevo (SendinBlue) – Email and OTP services

🧩 System Architecture Overview
scss
Copy code
Frontend (React + Tailwind)
        ↓
Node.js + Express (API Gateway)
        ↓
FastAPI Microservice (Model Inference)
        ↓
MongoDB Atlas (Data Storage)
        ↓
Supabase (X-ray Storage)
🔐 Security Highlights
End-to-end data encryption

JWT + 2FA authentication

OTP-based login & email verification

Field-level encryption for medical records

Secure file handling & upload validation


📚 Future Enhancements
Integration with government TB databases

AI explainability (Grad-CAM visualizations)

Doctor collaboration and second opinions

Multi-language support

Mobile app (React Native)

📄 License
This project is licensed under the MIT License – see the LICENSE file for details.

🤝 Contributing
Contributions, issues, and feature requests are welcome!
Feel free to fork this repo and submit a pull request.

🌐 Deployment Links
Frontend (React) – Vercel Deployment

Backend (Express API) – Render Deployment
ML Service (FastAPI) – Hugging Face Space
