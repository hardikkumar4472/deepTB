import { supabase } from "../config/supabase.js";
import fs from "fs";

export const uploadToSupabase = async (file) => {
  try {
    const fileBuffer = file.buffer;
    
    const { data, error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(`xrays/${Date.now()}_${file.originalname}`, fileBuffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.mimetype,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .getPublicUrl(data.path);
    
    return urlData.publicUrl;
  } catch (err) {
    throw new Error("Supabase Upload Failed: " + err.message);
  }
};
