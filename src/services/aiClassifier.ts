import { wasteApi } from "../api/wasteApi";
import { supabase } from "../lib/supabase";
import type { WastePrediction, CategoryDetails } from "../types";

export async function classifyWaste(imageFile: File): Promise<WastePrediction> {
  const predictedCategory: string = await wasteApi.classifyWaste(imageFile);

  const confidence = 0.9; // Placeholder until backend sends real confidence

  // Fetch the actual category details from database
  const { data: categoryData, error } = await supabase
    .from("waste_categories")
    .select("*")
    .eq("name", predictedCategory)
    .single();

  if (error || !categoryData) {
    console.error("Error fetching category:", error);
    // Fallback to default values if category not found
    const categoryDetails: CategoryDetails = {
      id: "default",
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

  const categoryDetails: CategoryDetails = {
    id: categoryData.id,
    name: categoryData.name,
    description: categoryData.description,
    disposal_instructions: categoryData.disposal_instructions,
    environmental_impact: categoryData.environmental_impact,
    points_value: categoryData.points_value,
    co2_impact_kg: categoryData.co2_impact_kg,
    icon_name: categoryData.icon_name,
    color: categoryData.color,
    created_at: categoryData.created_at,
  };

  return {
    category: predictedCategory,
    confidence,
    categoryDetails,
  };
}
