import { wasteApi } from "../api/wasteApi";
import type { WastePrediction, CategoryDetails } from "../types";

export async function classifyWaste(imageFile: File): Promise<WastePrediction> {
  const predictedCategory: string = await wasteApi.classifyWaste(imageFile);

  const confidence = 0.9; // Placeholder until backend sends real confidence

  const categoryDetails: CategoryDetails = {
    id: "1",
    name: predictedCategory,
    description: `Predicted as ${predictedCategory} by AI model.`,
    disposal_instructions: "Dispose properly",
    environmental_impact: "Low",
    points_value: 50,
    co2_impact_kg: 1.2,
    icon_name: "recycle",
    color: "#34D399",
    created_at: new Date().toISOString(),
  };

  return {
    category: predictedCategory,
    confidence,
    categoryDetails,
  };
}
