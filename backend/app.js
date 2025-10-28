
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import tbRoutes from "./routes/tb.js";
import uploadRoutes from "./routes/upload.js";
import fileUpload from "express-fileupload";
import paymentRoutes from "./routes/payment.js";
import reportRoutes from "./routes/report.js";
import drRoutes from "./routes/dr.js";
import cors from "cors";
import resultRoutes from "./routes/result.js";
import patientRoutes from "./routes/patient.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(fileUpload({
  createParentPath: true,
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  useTempFiles: true,
  tempFileDir: '/tmp/',
  safeFileNames: true,
  preserveExtension: true,
  abortOnLimit: true
}));

app.use((req, res, next) => {
  console.log('📨 Incoming Request:', {
    method: req.method,
    url: req.url,
    contentType: req.headers['content-type'],
    hasFiles: !!req.files,
    filesCount: req.files ? Object.keys(req.files).length : 0,
    hasBody: !!req.body,
    bodyKeys: req.body ? Object.keys(req.body) : []
  });
  next();
});

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/tb", tbRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/report",reportRoutes);
app.use("/api/dr",drRoutes);
app.use("/api/result",resultRoutes);
app.use("/api/patient",patientRoutes);


app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
});
