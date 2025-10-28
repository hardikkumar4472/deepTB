import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import DenseNet121
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout, BatchNormalization
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
import matplotlib.pyplot as plt
import numpy as np
import os
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
from sklearn.utils.class_weight import compute_class_weight

# -------------------------
# Parameters
# -------------------------
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 50

# -------------------------
# Dataset Balance (Based on your dataset)
# -------------------------
NORMAL_COUNT = 3500
TB_COUNT = 700
TOTAL = NORMAL_COUNT + TB_COUNT

print(f"Dataset Statistics:")
print(f"Normal images: {NORMAL_COUNT}")
print(f"TB images: {TB_COUNT}")
print(f"Total images: {TOTAL}")
print(f"TB ratio: {TB_COUNT/TOTAL:.2%}")
print(f"Class imbalance ratio: {NORMAL_COUNT/TB_COUNT:.1f}:1")

# -------------------------
# Calculate STRONG Class Weights
# -------------------------
def get_class_weights():
    # More aggressive weighting to compensate for imbalance
    weight_for_0 = TOTAL / (2 * NORMAL_COUNT)  # Normal class
    weight_for_1 = TOTAL / (2 * TB_COUNT)      # TB class - this will be higher
    
    class_weights = {0: weight_for_0, 1: weight_for_1}
    print(f"\nClass weights:")
    print(f"Normal (0): {weight_for_0:.2f}")
    print(f"TB (1): {weight_for_1:.2f}")
    print(f"TB weight is {weight_for_1/weight_for_0:.1f}x higher than Normal")
    
    return class_weights

class_weights = get_class_weights()

# -------------------------
# Enhanced Data Augmentation
# -------------------------
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=15,
    width_shift_range=0.2,
    height_shift_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    brightness_range=[0.8, 1.2],
    shear_range=0.1,
    fill_mode='nearest'
)

val_datagen = ImageDataGenerator(rescale=1./255)

train_generator = train_datagen.flow_from_directory(
    'dataset/train',
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='binary',
    shuffle=True,
    seed=42
)

val_generator = val_datagen.flow_from_directory(
    'dataset/val',
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='binary',
    shuffle=False
)

# -------------------------
# Improved Model with Better Architecture
# -------------------------
def create_balanced_model():
    # Use pre-trained DenseNet with fine-tuning
    base_model = DenseNet121(
        weights='imagenet', 
        include_top=False, 
        input_shape=(224, 224, 3)
    )
    
    # Freeze initial layers, unfreeze later ones
    base_model.trainable = True
    for layer in base_model.layers[:-30]:
        layer.trainable = False
    
    inputs = tf.keras.Input(shape=(224, 224, 3))
    x = base_model(inputs, training=False)
    x = GlobalAveragePooling2D()(x)
    x = BatchNormalization()(x)
    x = Dropout(0.6)(x)  # Increased dropout
    x = Dense(512, activation='relu')(x)
    x = BatchNormalization()(x)
    x = Dropout(0.5)(x)
    x = Dense(256, activation='relu')(x)
    x = Dropout(0.4)(x)
    outputs = Dense(1, activation='sigmoid')(x)
    
    model = Model(inputs, outputs)
    
    # Lower learning rate for fine-tuning
    model.compile(
        optimizer=Adam(learning_rate=1e-4),
        loss='binary_crossentropy',
        metrics=[
            'accuracy',
            'precision',
            'recall',
            tf.keras.metrics.AUC(name='auc')
        ]
    )
    
    return model

model = create_balanced_model()
model.summary()

# -------------------------
# Enhanced Callbacks
# -------------------------
checkpoint = ModelCheckpoint(
    'tb_model_balanced.h5',
    monitor='val_auc',  # Monitor AUC for better imbalance handling
    save_best_only=True,
    mode='max',
    verbose=1
)

early_stop = EarlyStopping(
    monitor='val_auc',
    patience=15,
    restore_best_weights=True,
    mode='max'
)

reduce_lr = ReduceLROnPlateau(
    monitor='val_loss',
    factor=0.5,
    patience=8,
    min_lr=1e-7,
    verbose=1
)

# -------------------------
# Training with Focal Loss (Alternative approach)
# -------------------------
# Focal loss helps with class imbalance
def focal_loss(gamma=2., alpha=0.25):
    def focal_loss_fixed(y_true, y_pred):
        pt_1 = tf.where(tf.equal(y_true, 1), y_pred, tf.ones_like(y_pred))
        pt_0 = tf.where(tf.equal(y_true, 0), y_pred, tf.zeros_like(y_pred))
        return -tf.reduce_mean(alpha * tf.pow(1. - pt_1, gamma) * tf.math.log(pt_1 + 1e-8)) - tf.reduce_mean((1 - alpha) * tf.pow(pt_0, gamma) * tf.math.log(1. - pt_0 + 1e-8))
    return focal_loss_fixed

# Uncomment if you want to try focal loss instead of class weights
# model.compile(
#     optimizer=Adam(1e-4),
#     loss=focal_loss(),
#     metrics=['accuracy', 'precision', 'recall', 'auc']
# )

# -------------------------
# Train Model
# -------------------------
print("\nStarting training with class imbalance handling...")
history = model.fit(
    train_generator,
    steps_per_epoch=len(train_generator),
    validation_data=val_generator,
    validation_steps=len(val_generator),
    epochs=EPOCHS,
    callbacks=[checkpoint, early_stop, reduce_lr],
    class_weight=class_weights,  # Critical for imbalance
    verbose=1
)

# -------------------------
# Comprehensive Evaluation
# -------------------------
def evaluate_model(model, generator):
    generator.reset()
    predictions = model.predict(generator, verbose=1)
    predicted_classes = (predictions > 0.5).astype(int)
    
    true_classes = generator.classes
    class_labels = list(generator.class_indices.keys())
    
    print("\n" + "="*50)
    print("MODEL EVALUATION")
    print("="*50)
    
    print(f"\nAUC Score: {roc_auc_score(true_classes, predictions):.4f}")
    
    print("\nClassification Report:")
    print(classification_report(true_classes, predicted_classes, target_names=class_labels))
    
    print("Confusion Matrix:")
    cm = confusion_matrix(true_classes, predicted_classes)
    print(cm)
    
    # Calculate additional metrics
    tn, fp, fn, tp = cm.ravel()
    sensitivity = tp / (tp + fn)
    specificity = tn / (tn + fp)
    
    print(f"\nSensitivity (TPR): {sensitivity:.4f}")
    print(f"Specificity (TNR): {specificity:.4f}")
    print(f"Balanced Accuracy: {(sensitivity + specificity)/2:.4f}")

# Evaluate on validation set
evaluate_model(model, val_generator)

# -------------------------
# Enhanced Visualization
# -------------------------
def plot_comprehensive_history(history):
    fig, axes = plt.subplots(2, 3, figsize=(18, 12))
    
    metrics = ['accuracy', 'loss', 'precision', 'recall', 'auc']
    titles = ['Accuracy', 'Loss', 'Precision', 'Recall', 'AUC']
    
    for i, (metric, title) in enumerate(zip(metrics, titles)):
        row, col = i // 3, i % 3
        axes[row, col].plot(history.history[metric], label=f'Train {title}')
        axes[row, col].plot(history.history[f'val_{metric}'], label=f'Val {title}')
        axes[row, col].set_title(f'Model {title}')
        axes[row, col].set_xlabel('Epoch')
        axes[row, col].set_ylabel(title)
        axes[row, col].legend()
        axes[row, col].grid(True)
    
    plt.tight_layout()
    plt.savefig('comprehensive_training_history.png', dpi=300, bbox_inches='tight')
    plt.show()

plot_comprehensive_history(history)

# -------------------------
# Save Final Model
# -------------------------
model.save('tb_model_final_balanced.h5')
print("\nModel saved as 'tb_model_final_balanced.h5'")

# -------------------------
# Test Prediction on Sample
# -------------------------
def test_prediction(model, image_path):
    img = tf.keras.preprocessing.image.load_img(image_path, target_size=IMG_SIZE)
    img_array = tf.keras.preprocessing.image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    
    prediction = model.predict(img_array)[0][0]
    confidence = prediction if prediction > 0.5 else 1 - prediction
    label = "TB" if prediction > 0.5 else "Normal"
    
    print(f"\nTest Prediction:")
    print(f"Raw score: {prediction:.4f}")
    print(f"Prediction: {label}")
    print(f"Confidence: {confidence:.4f}")

print("\nTraining completed! Use the saved model for predictions.")