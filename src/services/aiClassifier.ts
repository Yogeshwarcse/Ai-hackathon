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
    throw new Error(`Category '${predictedCategory}' not found in database. Please seed waste_categories.`);
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
