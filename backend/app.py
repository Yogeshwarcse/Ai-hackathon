# app.py
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import torch
from torchvision import transforms, models
import torch.nn.functional as F

app = FastAPI(title="GreenCity Waste Classifier")

# Allow CORS for frontend testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # replace with frontend URL if needed
    allow_methods=["*"],
    allow_headers=["*"],
)

# Device
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# Classes
CLASSES = ['cardboard', 'glass', 'metal', 'paper', 'plastic', 'trash']

# Load EfficientNet-B0 architecture
model = models.efficientnet_b0(weights=None)  # no pretrained
model.classifier[1] = torch.nn.Linear(model.classifier[1].in_features, len(CLASSES))

# Load trained weights
model.load_state_dict(torch.load("green_city_best.pt", map_location=DEVICE))
model.to(DEVICE)
model.eval()

# Image transforms (same as training)
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    try:
        # Open image
        img = Image.open(file.file).convert("RGB")
        img = transform(img).unsqueeze(0).to(DEVICE)

        # Predict
        with torch.no_grad():
            outputs = model(img)
            probs = F.softmax(outputs, dim=1)
            conf, pred = torch.max(probs, 1)

        return {
            "predicted_class": CLASSES[pred.item()],
            "confidence": float(conf.item())
        }
    except Exception as e:
        return {"error": str(e)}