from fastapi import FastAPI, File, UploadFile
import uvicorn
import tensorflow as tf
from PIL import Image
import numpy as np
import io
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


try:
    model = tf.keras.models.load_model('tb_model_balanced.h5')
    print("✅ Loaded balanced model")
except:
    try:
        model = tf.keras.models.load_model('tb_model_final_balanced.h5')
        print("✅ Loaded final balanced model")
    except:
        model = tf.keras.models.load_model('tb_model.h5')
        print("✅ Loaded original model")


def preprocess_image(file):
    img = Image.open(io.BytesIO(file)).convert('RGB')
    img = img.resize((224, 224))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array


@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    try:
        img_bytes = await file.read()
        img_array = preprocess_image(img_bytes)

        prediction = model.predict(img_array, verbose=0)[0][0]

        threshold = 0.5
        label = "TB" if prediction > threshold else "Normal"

        confidence = float(prediction) if label == "TB" else float(1 - prediction)

        result = {
            "label": label,
            "confidence": round(confidence, 4),
            "raw_prediction": float(prediction),
            "threshold_used": threshold
        }

        print(f"✅ Prediction result: {result}")
        return result

    except Exception as e:
        print(f"❌ Prediction failed: {e}")
        return {"error": str(e)}


@app.get("/")
async def root():
    return {"message": "TB Detection API - Model Ready (No Heatmap)"}


@app.get("/health")
async def health():
    return {"status": "healthy", "model_loaded": True}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
