import tensorflow as tf
import numpy as np
import cv2
from tensorflow.keras.models import Model
from PIL import Image
import os

def make_gradcam_heatmap(img_array, model, last_conv_layer_name="conv5_block16_concat", pred_index=None):
    try:
        base_model = model.get_layer("densenet121")
        last_conv_layer = base_model.get_layer(last_conv_layer_name)

        grad_model = Model(
            inputs=model.inputs,
            outputs=[last_conv_layer.output, model.output]
        )

        with tf.GradientTape() as tape:
            conv_outputs, predictions = grad_model(img_array)
            if pred_index is None:
                class_channel = predictions[:, 0]
            else:
                class_channel = predictions[:, pred_index]

        grads = tape.gradient(class_channel, conv_outputs)
        if grads is None:
            raise ValueError("Gradients are None. Possibly disconnected layer.")

        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
        conv_outputs = conv_outputs[0]
        heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
        heatmap = tf.squeeze(heatmap)

        heatmap = tf.maximum(heatmap, 0) / (tf.reduce_max(heatmap) + 1e-10)
        return heatmap.numpy()

    except Exception as e:
        print(f"Grad-CAM generation failed: {e}")
        return None


def overlay_heatmap(image_path, heatmap, alpha=0.4, output_path="gradcam.jpg"):
    try:
        image = Image.open(image_path).convert('RGB')
        image = np.array(image)

        if heatmap is None:
            raise ValueError("Heatmap is None.")

        heatmap = cv2.resize(heatmap, (image.shape[1], image.shape[0]))
        heatmap = np.uint8(255 * heatmap)
        heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

        superimposed_img = cv2.addWeighted(image, 1 - alpha, heatmap, alpha, 0)
        Image.fromarray(superimposed_img).save(output_path)

        print(f"✅ Grad-CAM heatmap saved as: {output_path}")
        return os.path.abspath(output_path)

    except Exception as e:
        print(f"Error overlaying heatmap: {e}")
        return None


