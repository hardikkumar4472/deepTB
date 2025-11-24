import os
import cv2
import numpy as np
import pandas as pd

# Define expected path for the mounted Kaggle data (from docker-compose.yml)
DATA_PATH = "/app/data/TB_Chest_Radiography_Database/"
IMAGE_SIZE = (224, 224) # Standard input size for DenseNet121

def load_data_and_preprocess():
    """
    Placeholder function to simulate loading and preprocessing X-ray images.
    This will be fully implemented in Phase 3.
    """
    print("--- Starting Data Loading and Preprocessing (Phase 2 Planning) ---")

    if not os.path.isdir(DATA_PATH):
        print(f"ERROR: Data path not found: {DATA_PATH}")
        print("Please ensure the Kaggle dataset is unzipped into the ./data folder.")
        return None, None # Return None if data is missing

    # Directories for the two classes in the dataset
    normal_dir = os.path.join(DATA_PATH, "Normal")
    tb_dir = os.path.join(DATA_PATH, "Tuberculosis")
    
    # 1. Define the number of images to load (just for planning/testing)
    num_normal = len(os.listdir(normal_dir)) if os.path.isdir(normal_dir) else 0
    num_tb = len(os.listdir(tb_dir)) if os.path.isdir(tb_dir) else 0

    print(f"Found {num_normal} Normal images and {num_tb} TB images.")
    print(f"Data will be resized to {IMAGE_SIZE} and normalized.")
    print("--- Data Loading Plan Complete ---")
    
    # Simulate returning data and labels for Phase 3
    return np.array([0]), np.array([0]) 

if __name__ == '__main__':
    load_data_and_preprocess()