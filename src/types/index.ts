export interface CategoryDetails {
  id: string;
  name: string;
  description: string;
  disposal_instructions: string;
  environmental_impact: string;
  points_value: number;
  co2_impact_kg: number;
  icon_name: string;
  color: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  total_scans: number;
  total_points: number;
  co2_saved_kg: number;
  trees_saved: number;
  created_at: string;
  updated_at: string;
}

export interface WasteScan {
  id: string;
  user_id: string;
  category_id: string;
  image_url: string | null;
  confidence_score: number | null;
  location: string | null;
  points_earned: number;
  co2_saved_kg: number;
  properly_disposed: boolean;
  created_at: string;
  category?: CategoryDetails;
}

export interface Achievement {
  id: string;
  user_id: string;
  achievement_type: string;
  title: string;
  description: string;
  badge_icon: string;
  unlocked_at: string;
}

export interface WastePrediction {
  category: string;
  confidence: number;
  categoryDetails: CategoryDetails;
}

export interface ImpactStats {
  totalScans: number;
  totalPoints: number;
  co2SavedKg: number;
  treesSaved: number;
}
