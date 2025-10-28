import { supabase } from "../config/supabase.js";
import fs from "fs";

export const uploadToSupabase = async (file) => {
  try {
    const fileStream = fs.createReadStream(file.path);
    const { data, error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(`xrays/${Date.now()}_${file.originalname}`, fileStream, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.mimetype,
      });

    if (error) throw error;

    const { publicUrl, error: urlError } = supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .getPublicUrl(data.path);
    if (urlError) throw urlError;

    return publicUrl;
  } catch (err) {
    throw new Error("Supabase Upload Failed: " + err.message);
  } finally {

    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
  }
};
