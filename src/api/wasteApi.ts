import { supabase } from '../lib/supabase';
import type { WasteCategory, WasteScan, UserProfile } from '../types';

// Your local Python backend URL
const API_BASE = "http://127.0.0.1:8000";

export const wasteApi = {
  // ---- 1️⃣ Image Classification (Python) ----
  async classifyWaste(imageFile: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", imageFile);

    const response = await fetch(`${API_BASE}/predict/`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Prediction failed");
    const data = await response.json();
    return data.predicted_class; // return predicted waste type
  },

  // ---- 2️⃣ Supabase: Store Scan + Points ----
  async createScan(scan: {
    category_id: string;
    confidence_score: number;
    points_earned: number;
    co2_saved_kg: number;
    image_url?: string;
    location?: string;
  }): Promise<{ scan: WasteScan | null; updatedProfile?: UserProfile | null }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Insert the scan record
    const { data: insertedScan, error: insertError } = await supabase
      .from("waste_scans")
      .insert({
        user_id: user.id,
        ...scan,
        properly_disposed: true,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Increment profile stats via RPC
    const { data: rpcData, error: rpcError } = await supabase.rpc("increment_points", {
      p_user_id: user.id,
      p_points: scan.points_earned ?? 0,
      p_co2: scan.co2_saved_kg ?? 0,
    });

    if (rpcError) {
      console.error("RPC increment_points error:", rpcError);
    }

    const updatedProfile = Array.isArray(rpcData) ? rpcData[0] : rpcData || null;

    return { scan: insertedScan || null, updatedProfile };
  },

  // ---- 3️⃣ Supabase: Get Leaderboard ----
  async getLeaderboard(limit = 100): Promise<UserProfile[]> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("total_points", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  // ---- 4️⃣ Supabase: Get User Rank ----
  async getUserRank(userId: string): Promise<number> {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, total_points")
      .order("total_points", { ascending: false });

    if (error) throw error;

    const rank = data?.findIndex((profile) => profile.id === userId);
    return rank !== undefined && rank !== -1 ? rank + 1 : 0;
  },

  // ---- 5️⃣ Optional: Get User Scans ----
  async getUserScans(limit = 50): Promise<WasteScan[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("waste_scans")
      .select(`
        *,
        category:waste_categories(*)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },
};
