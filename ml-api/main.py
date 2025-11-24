# ml-api/main.py
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import tensorflow as tf
import numpy as np

# --- 1. Model & Paths Setup (Phase 2) ---
MODEL_PATH = "./model/densenet121_tb_model.h5"  # Placeholder model path
LABELS = ["Mild", "Moderate", "Severe", "Normal"]
model = None # The model will be loaded in the startup event

# --- 2. FastAPI Initialization ---
app = FastAPI(title="TB Detection ML API")

@app.on_event("startup")
async def load_ml_model():
    """Loads the TensorFlow model when the FastAPI service starts."""
    global model
    try:
        # In a real project, replace this with the actual model loading:
        # model = tf.keras.models.load_model(MODEL_PATH)
        
        # MOCK MODEL LOADING: For development, we create a mock model structure
        from tensorflow.keras.models import Sequential
        from tensorflow.keras.layers import Dense
        model = Sequential([Dense(len(LABELS), input_shape=(224*224*3,))])
        print("ML Model loaded successfully (Mocked).")
        
    except Exception as e:
        print(f"Error loading model: {e}")
        # Exit or log error if the real model failed to load
        
# --- 3. Health Check Endpoint (From Phase 1) ---
@app.get("/")
def read_root():
    return {"message": "TB Detection ML API Service Running."}

# --- 4. Prediction Endpoint (Phase 3 Placeholder) ---
@app.post("/predict")
async def predict_tb(file: UploadFile = File(...)):
    if not model:
        return JSONResponse(status_code=500, content={"error": "Model not loaded."})

    # This is where the core Phase 3 logic will go:
    # 1. Read image (file.file.read())
    # 2. Pre-process (Resize, Normalize)
    # 3. Predict (model.predict())
    # 4. Generate Grad-CAM heatmap (for Explainability)

    # MOCK RESULT for Phase 2/3 confirmation
    mock_prediction = np.random.choice(LABELS)
    
    return {
        "prediction": mock_prediction,
        "severity": mock_prediction,
        "heatmap_url": "/reports/mock-heatmap-url.png",
        "confidence": float(np.random.uniform(0.7, 0.95))
    }