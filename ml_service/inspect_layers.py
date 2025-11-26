
import tensorflow as tf

model = tf.keras.models.load_model('tb_model_balanced.h5')
print("✅ Model loaded")

try:
    base_model = model.get_layer("densenet121")
    print("\n=== Inside DenseNet121 layers ===")
    for layer in reversed(base_model.layers[-10:]):   
        print(layer.name, layer.output.shape)
except Exception as e:
    print("⚠️ Could not inspect DenseNet121:", e)
