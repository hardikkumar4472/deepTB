import { supabase } from "../config/supabase.js";
import Result from "../models/result.js";
import axios from "axios";
import FormData from "form-data";
import fs from 'fs';

export const predictTB = async (req, res) => {
  try {
    console.log("📨 Request received - checking files and body...");
    console.log("📁 req.files:", req.files ? Object.keys(req.files) : 'No files');

    if (req.files) {
      console.log("🔍 Full files structure:", JSON.stringify(req.files, null, 2));
    }

    let fileBuffer, fileName, mimeType;

    if (req.files) {
      const file = req.files.file || req.files.image;

      if (!file) {
        return res.status(400).json({
          error: "No file found",
          details: `Available files: ${Object.keys(req.files).join(', ')}. Use key 'file' or 'image'`
        });
      }

      console.log("📄 Processing file:", {
        name: file.name,
        mimetype: file.mimetype,
        size: file.size,
        tempFilePath: file.tempFilePath,
        truncated: file.truncated,
        dataExists: !!file.data,
        dataLength: file.data ? file.data.length : 0,
        mvExists: !!file.mv
      });

      if (file.data && file.data.length > 0) {
        fileBuffer = file.data;
        console.log("💾 Using in-memory buffer, size:", fileBuffer.length);
      } else if (file.tempFilePath) {
        console.log("📂 Reading from temp file:", file.tempFilePath);
        fileBuffer = fs.readFileSync(file.tempFilePath);
        console.log("📖 Temp file read, size:", fileBuffer.length);
      } else {
        return res.status(400).json({
          error: "File buffer is empty",
          details: "The uploaded file has no data. Check your file upload configuration."
        });
      }

      fileName = `xrays/${Date.now()}_${file.name}`;
      mimeType = file.mimetype;

    } else if (req.body && req.body.image) {
      console.log("🖼️ Processing base64 image from body");
      const { image } = req.body;

      if (!image || typeof image !== 'string') {
        return res.status(400).json({ error: "Invalid base64 image data" });
      }

      const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
      fileBuffer = Buffer.from(base64Data, 'base64');
      fileName = `xrays/${Date.now()}_image.jpg`;
      mimeType = 'image/jpeg';

      console.log("📊 Base64 image processed, size:", fileBuffer.length);

    } else {
      return res.status(400).json({
        error: "No image provided",
        details: "Send image as form-data with key 'file' or 'image', or as base64 in JSON body"
      });
    }

    if (!fileBuffer || fileBuffer.length === 0) {
      console.log("❌ File buffer validation failed:");
      console.log(" - Buffer exists:", !!fileBuffer);
      console.log(" - Buffer length:", fileBuffer?.length || 0);
      return res.status(400).json({
        error: "Empty file buffer",
        details: "The file buffer is empty or invalid. File size might be 0 bytes."
      });
    }

    console.log("✅ File buffer ready, size:", fileBuffer.length);

    console.log("☁️ Uploading to Supabase...");
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(fileName, fileBuffer, {
        contentType: mimeType,
        upsert: false
      });

    if (uploadError) {
      console.error("❌ Supabase upload error:", uploadError);
      throw uploadError;
    }

    const { data: urlData } = supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .getPublicUrl(fileName);

    console.log("✅ File uploaded to:", urlData.publicUrl);

    console.log("🤖 Sending to FastAPI:", process.env.FASTAPI_URL);

    const formData = new FormData();
    formData.append('file', fileBuffer, {
      filename: fileName,
      contentType: mimeType
    });

    const mlResponse = await axios.post(
      process.env.FASTAPI_URL,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
        timeout: 30000
      }
    );

    console.log("✅ FastAPI raw response:", JSON.stringify(mlResponse.data, null, 2));

    const modelOutput = mlResponse.data;

    if (!modelOutput) {
      throw new Error("Empty response from ML model");
    }

    console.log("🔍 Model output analysis:", {
      label: modelOutput.label,
      confidence: modelOutput.confidence,
      raw_prediction: modelOutput.raw_prediction,
      threshold_used: modelOutput.threshold_used
    });

    const rawPred = Number(modelOutput.raw_prediction);
    const threshold = Number(modelOutput.threshold_used) || 0.5;

    console.log("🔢 Parsed values:", {
      rawPred,
      threshold,
      isRawPredNaN: isNaN(rawPred)
    });

    if (isNaN(rawPred)) {
      throw new Error(`Invalid raw_prediction: "${modelOutput.raw_prediction}"`);
    }

    let finalLabel, finalConfidence;

    if (rawPred <= threshold) {
      finalLabel = "Normal";
      finalConfidence = 1 - rawPred;
    } else {
      finalLabel = "TB";
      finalConfidence = rawPred;
    }

    finalConfidence = parseFloat(finalConfidence.toFixed(6));
    const finalRawPred = parseFloat(rawPred.toFixed(8));

    console.log("🎯 Final result:", {
      finalLabel,
      finalConfidence,
      finalRawPred,
      threshold
    });

    const savedResult = await Result.create({
      userId: req.user?.id,
      imageUrl: urlData.publicUrl,
      label: finalLabel,
      confidence: finalConfidence,
      raw_prediction: finalRawPred,
      threshold_used: threshold
    });

    console.log("💾 Result saved to database with ID:", savedResult._id);

    res.json({
      resultId: savedResult._id,
      imageUrl: urlData.publicUrl,
      label: finalLabel,
      confidence: finalConfidence,
      raw_prediction: finalRawPred,
      threshold_used: threshold,
      message: "Prediction completed successfully"
    });

  } catch (err) {
    console.error("❌ Prediction error:", err.message);
    console.error("Error stack:", err.stack);

    res.status(500).json({
      error: "Prediction failed",
      details: err.message
    });
  }
};