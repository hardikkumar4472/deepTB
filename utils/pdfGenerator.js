import PDFDocument from "pdfkit";
import fs from "fs";
import { MongoClient, ObjectId } from "mongodb";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const DB_NAME = process.env.DB_NAME || "tb_detection_db";

export const generateReportPDF = async ({
  outputPath,
  patientId,
  patientName,
  patientEmail,
  patientAge,
  patientGender,
  patientPhone,
  xrayUrl,
  label,
  raw_prediction,
  heatmapUrl,
  doctorNotes,
  doctorName,
  doctorLicense,
  dateOfTest,
  recommendations
}) => {
  return new Promise(async (resolve, reject) => {
    let client;

    try {
      client = new MongoClient(MONGO_URI);
      await client.connect();
      const db = client.db(DB_NAME);

      let finalPatientName = patientName || "Unknown Patient";
      let finalPatientEmail = patientEmail || "Not Provided";
      let finalPatientAge = patientAge || "N/A";
      let finalPatientGender = patientGender || "N/A";
      let finalPatientPhone = patientPhone || "Not Provided";
      let finalPatientId = patientId || "N/A";

      if (patientId && (!patientName || !patientEmail)) {
        try {
          console.log("🔍 Fetching patient data for ID:", patientId);

          const tbUsersCollection = db.collection("tb_users");
          const patientData = await tbUsersCollection.findOne({
            _id: new ObjectId(patientId)
          });

          if (patientData) {
            finalPatientName = patientData.name || finalPatientName;
            finalPatientEmail = patientData.email || finalPatientEmail;
            finalPatientAge = patientData.age || finalPatientAge;
            finalPatientGender = patientData.gender || finalPatientGender;
            finalPatientPhone = patientData.phoneNumber || finalPatientPhone;
            finalPatientId = patientId;

            console.log("✅ Patient data fetched successfully:", {
              name: finalPatientName,
              email: finalPatientEmail,
              age: finalPatientAge,
              gender: finalPatientGender,
              phone: finalPatientPhone
            });
          } else {
            console.warn("⚠️ Patient not found with ID:", patientId);
          }
        } catch (dbError) {
          console.error("❌ Database error fetching patient:", dbError);
        }
      }

      const doc = new PDFDocument({
        margin: 40,
        size: 'A4',
        info: {
          Title: 'DeepTB Medical Report',
          Author: 'DeepTB Diagnostic System',
          Subject: 'Tuberculosis Detection Report'
        }
      });

      const writeStream = fs.createWriteStream(outputPath);
      doc.pipe(writeStream);

      const primaryColor = '#2c5aa0';
      const secondaryColor = '#4CAF50';
      const dangerColor = '#f44336';
      const grayColor = '#757575';

      const tbChances = parseFloat((raw_prediction * 100).toFixed(2));
      const isTBPositive = tbChances > 10;

      const resultColor = isTBPositive ? dangerColor : secondaryColor;
      const resultBackground = isTBPositive ? '#ffebee' : '#e8f5e8';
      const resultText = isTBPositive ? 'TUBERCULOSIS POSITIVE' : 'TUBERCULOSIS NEGATIVE';
      const riskLevel = isTBPositive ? 'HIGH' : 'LOW';

      console.log("🔍 TB Analysis:", {
        raw_prediction,
        tbChances: `${tbChances}%`,
        isTBPositive,
        resultText
      });

      doc.fillColor(primaryColor)
        .rect(0, 0, doc.page.width, 100)
        .fill();

      doc.fillColor('#ffffff')
        .fontSize(20)
        .font('Helvetica-Bold')
        .text('DeepTB', 50, 25)
        .fontSize(8)
        .font('Helvetica')
        .text('AI-Powered Tuberculosis Detection', 50, 50)
        .text('Certified Medical Diagnostic System', 50, 62);

      const generatedReportId = `DTB-${Date.now()}`;

      doc.fillColor('#ffffff')
        .fontSize(8)
        .text('Report ID:', doc.page.width - 150, 30)
        .text(generatedReportId, doc.page.width - 150, 42)
        .text('Date:', doc.page.width - 150, 54)
        .text(dateOfTest || new Date().toLocaleDateString('en-GB'), doc.page.width - 150, 66);

      doc.fillColor('#000000')
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('PATIENT INFORMATION', 50, 120);

      doc.moveTo(50, 135)
        .lineTo(doc.page.width - 50, 135)
        .strokeColor(primaryColor)
        .lineWidth(1)
        .stroke();

      const startY = 145;
      const lineHeight = 15;

      doc.fontSize(9)
        .font('Helvetica-Bold')
        .text('Full Name:', 50, startY)
        .text('Patient ID:', 50, startY + lineHeight)
        .text('Email:', 50, startY + lineHeight * 2)
        .text('Phone:', 50, startY + lineHeight * 3)
        .text('Age/Gender:', 50, startY + lineHeight * 4)
        .text('Test Date:', 50, startY + lineHeight * 5);

      doc.font('Helvetica')
        .text(finalPatientName, 120, startY)
        .text(finalPatientId.toString(), 120, startY + lineHeight)
        .text(finalPatientEmail, 120, startY + lineHeight * 2)
        .text(finalPatientPhone, 120, startY + lineHeight * 3)
        .text(`${finalPatientAge} / ${finalPatientGender}`, 120, startY + lineHeight * 4)
        .text(dateOfTest || new Date().toLocaleDateString('en-GB'), 120, startY + lineHeight * 5);

      const resultsY = startY + lineHeight * 6 + 20;
      doc.fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#000000')
        .text('TEST RESULTS', 50, resultsY);

      doc.moveTo(50, resultsY + 15)
        .lineTo(doc.page.width - 50, resultsY + 15)
        .strokeColor(primaryColor)
        .lineWidth(1)
        .stroke();

      const resultBoxY = resultsY + 25;
      const resultBoxHeight = 70;

      doc.rect(50, resultBoxY, doc.page.width - 100, resultBoxHeight)
        .fillColor(resultBackground)
        .fill()
        .strokeColor(resultColor)
        .lineWidth(2)
        .stroke();

      doc.fontSize(12)
        .font('Helvetica-Bold')
        .fillColor(resultColor)
        .text('AI DETECTION RESULT:', 65, resultBoxY + 10)
        .fontSize(16)
        .text(resultText, 65, resultBoxY + 25)
        .fontSize(10)
        .text(`TB Chances: ${tbChances}%`, 65, resultBoxY + 45);

      doc.fontSize(9)
        .fillColor(resultColor)
        .text(`Risk Level: ${riskLevel}`, doc.page.width - 150, resultBoxY + 45)
        .text(`Threshold: >10% = TB Positive`, doc.page.width - 150, resultBoxY + 57);

      const imagesY = resultBoxY + resultBoxHeight + 30;
      doc.fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#000000')
        .text('RADIOLOGICAL IMAGES', 50, imagesY);

      doc.moveTo(50, imagesY + 15)
        .lineTo(doc.page.width - 50, imagesY + 15)
        .strokeColor(primaryColor)
        .lineWidth(1)
        .stroke();

      let currentY = imagesY + 25;

      if (xrayUrl) {
        doc.fontSize(10)
          .fillColor(primaryColor)
          .text('CHEST X-RAY IMAGE:', 50, currentY);

        doc.fontSize(8)
          .fillColor(grayColor)
          .text('View online:', 50, currentY + 12);

        doc.fillColor(primaryColor)
          .text(xrayUrl, 50, currentY + 24, {
            link: xrayUrl,
            underline: true,
            width: doc.page.width - 100
          });

        currentY += 50;
      }

      if (heatmapUrl) {
        doc.fontSize(10)
          .fillColor(primaryColor)
          .text('AI HEATMAP ANALYSIS:', 50, currentY);

        doc.fontSize(8)
          .fillColor(grayColor)
          .text('View online:', 50, currentY + 12);

        doc.fillColor(primaryColor)
          .text(heatmapUrl, 50, currentY + 24, {
            link: heatmapUrl,
            underline: true,
            width: doc.page.width - 100
          });

        currentY += 50;
      }

      if (currentY > 600) {
        doc.addPage();
        currentY = 50;
      }

      doc.fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#000000')
        .text('MEDICAL NOTES', 50, currentY);

      doc.moveTo(50, currentY + 15)
        .lineTo(doc.page.width - 50, currentY + 15)
        .strokeColor(primaryColor)
        .lineWidth(1)
        .stroke();

      doc.fontSize(10)
        .font('Helvetica')
        .fillColor('#000000')
        .text(doctorNotes || "No additional notes provided by the reviewing physician.",
              50, currentY + 25, {
                width: doc.page.width - 100,
                align: 'left'
              });

      currentY += doctorNotes ? (doctorNotes.length / 60) * 12 + 40 : 60;

      const footerY = doc.page.height - 80;

      doc.fontSize(9)
        .fillColor(grayColor)
        .text('This report was generated by DeepTB AI Diagnostic System and reviewed by:',
              50, footerY);

      doc.font('Helvetica-Bold')
        .fillColor(primaryColor)
        .text(`Dr. ${doctorName || 'HARSHIT RANA'}`, 50, footerY + 12)
        .font('Helvetica')
        .fillColor(grayColor)
        .text(`License: ${doctorLicense || 'MED123456'}`, 50, footerY + 24);

      doc.moveTo(50, footerY + 35)
        .lineTo(200, footerY + 35)
        .strokeColor(grayColor)
        .lineWidth(1)
        .stroke();

      doc.text('Signature', 50, footerY + 38);

      doc.fontSize(7)
        .fillColor(grayColor)
        .text('Confidential Medical Document - For authorized use only',
              50, doc.page.height - 20, { align: 'center' })
        .text(`Generated on: ${new Date().toLocaleString('en-GB')} | DeepTB Report v1.0`,
              50, doc.page.height - 12, { align: 'center' });

      doc.end();

      writeStream.on("finish", () => {
        console.log("✅ PDF generated successfully:", outputPath);
        resolve({
          outputPath,
          reportId: generatedReportId,
          patientId: finalPatientId,
          patientName: finalPatientName,
          tbChances: `${tbChances}%`,
          result: resultText,
          generatedAt: new Date().toISOString()
        });
      });
      writeStream.on("error", reject);

    } catch (err) {
      console.error("❌ PDF generation error:", err);
      reject(err);
    } finally {
      if (client) {
        await client.close();
      }
    }
  });
};