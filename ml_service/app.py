# from fastapi import FastAPI, File, UploadFile
# import uvicorn
# import tensorflow as tf
# from PIL import Image
# import numpy as np
# import io
# import os
# from fastapi.middleware.cors import CORSMiddleware

# app = FastAPI()
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# try:
#     model = tf.keras.models.load_model('tb_model_balanced.h5')
#     print("✅ Loaded balanced model")
# except:
#     try:
#         model = tf.keras.models.load_model('tb_model_final_balanced.h5')
#         print("✅ Loaded final balanced model")
#     except:
#         model = tf.keras.models.load_model('tb_model.h5')
#         print("✅ Loaded original model")


# def preprocess_image(file):
#     img = Image.open(io.BytesIO(file)).convert('RGB')
#     img = img.resize((224, 224))
#     img_array = np.array(img) / 255.0
#     img_array = np.expand_dims(img_array, axis=0)
#     return img_array


# @app.post("/predict/")
# async def predict(file: UploadFile = File(...)):
#     try:
#         img_bytes = await file.read()
#         img_array = preprocess_image(img_bytes)

#         prediction = model.predict(img_array, verbose=0)[0][0]

#         threshold = 0.5
#         label = "TB" if prediction > threshold else "Normal"

#         confidence = float(prediction) if label == "TB" else float(1 - prediction)

#         result = {
#             "label": label,
#             "confidence": round(confidence, 4),
#             "raw_prediction": float(prediction),
#             "threshold_used": threshold
#         }

#         print(f"✅ Prediction result: {result}")
#         return result

#     except Exception as e:
#         print(f"❌ Prediction failed: {e}")
#         return {"error": str(e)}


# @app.get("/")
# async def root():
#     return {"message": "TB Detection API - Model Ready (No Heatmap)"}


# @app.get("/health")
# async def health():
#     return {"status": "healthy", "model_loaded": True}


from fastapi import FastAPI, File, UploadFile
import uvicorn
import tensorflow as tf
from PIL import Image
import numpy as np
import io
import os
import gc
import logging
from fastapi.middleware.cors import CORSMiddleware
from functools import lru_cache

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model loading with caching
@lru_cache(maxsize=1)
def load_model():
    model_files = [
        'tb_model_balanced.h5',
        'tb_model_final_balanced.h5', 
        'tb_model.h5'
    ]
    
    for model_file in model_files:
        try:
            model = tf.keras.models.load_model(model_file)
            logger.info(f"✅ Loaded model: {model_file}")
            return model
        except Exception as e:
            logger.warning(f"❌ Failed to load {model_file}: {e}")
            continue
    
    raise Exception("❌ All model loading attempts failed!")

# Load model once at startup
model = load_model()

def preprocess_image(file):
    """Preprocess image with memory efficiency"""
    try:
        img = Image.open(io.BytesIO(file)).convert('RGB')
        img = img.resize((224, 224))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        # Clean up
        del img
        return img_array
    except Exception as e:
        logger.error(f"Image preprocessing failed: {e}")
        raise

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    try:
        # Read file
        img_bytes = await file.read()
        
        # Preprocess
        img_array = preprocess_image(img_bytes)
        
        # Predict
        prediction = model.predict(img_array, verbose=0)[0][0]

        # Determine result
        threshold = 0.5
        label = "TB" if prediction > threshold else "Normal"
        confidence = float(prediction) if label == "TB" else float(1 - prediction)

        result = {
            "label": label,
            "confidence": round(confidence, 4),
            "raw_prediction": float(prediction),
            "threshold_used": threshold
        }

        logger.info(f"✅ Prediction: {result}")
        
        # Force garbage collection
        del img_array, img_bytes
        gc.collect()
        
        return result

    except Exception as e:
        logger.error(f"❌ Prediction failed: {e}")
        return {"error": str(e)}

@app.get("/")
async def root():
    return {"message": "TB Detection API - Optimized Memory Version"}

@app.get("/health")
async def health():
    return {"status": "healthy", "model_loaded": True}

# Critical: Add memory cleanup after each request
@app.middleware("http")
async def add_cleanup(request, call_next):
    response = await call_next(request)
    # Clean up after response
    gc.collect()
    return response

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=port,
        workers=1,  # Important: Use only 1 worker on Render
        loop="asyncio"
    )


# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8000)
