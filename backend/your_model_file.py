# your_model_file.py
from torchvision import models
import torch.nn as nn
import torch

class GreenCityModel(nn.Module):
    """
    EfficientNet-B0 model for GreenCity waste classification
    matching the trained checkpoint.
    """
    def __init__(self, num_classes=6):  # corrected __init__
        super(GreenCityModel, self).__init__()  # corrected super().__init__()
        self.model = models.efficientnet_b0(weights=None)  # no pretrained
        self.model.classifier[1] = nn.Linear(
            self.model.classifier[1].in_features,
            num_classes
        )

    def forward(self, x):
        return self.model(x)
