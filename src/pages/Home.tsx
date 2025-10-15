import { useState } from "react";
import { ImageUpload } from "../components/ImageUpload";
import { PredictionResult } from "../components/PredictionResult";
import { RecyclingGuide } from "../components/RecyclingGuide";
import { ImpactTracker } from "../components/ImpactTracker";
import { classifyWaste } from "../services/aiClassifier";
import { wasteApi } from "../api/wasteApi";
import { useAuth } from "../context/AuthContext";
import type { WastePrediction } from "../types";
import { Sparkles, CheckCircle } from "lucide-react";

export function Home() {
  const { profile, refreshProfile } = useAuth();
  const [prediction, setPrediction] = useState<WastePrediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleImageSelect = async (file: File) => {
    setLoading(true);
    setError(null);
    setPrediction(null);
    setSaved(false);

    try {
      const result = await classifyWaste(file);
      setPrediction(result);
    } catch (err) {
      console.error(err);
      setError("Failed to classify waste. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveScan = async () => {
    if (!prediction) return;

    try {
      const result = await wasteApi.createScan({
        category_id: prediction.categoryDetails.id, // Using actual UUID from database
        confidence_score: prediction.confidence,
        points_earned: prediction.categoryDetails.points_value ?? 50,
        co2_saved_kg: prediction.categoryDetails.co2_impact_kg ?? 1.2,
      });

      // Refresh profile to get updated stats
      await refreshProfile();
      setSaved(true);

      setTimeout(() => {
        setPrediction(null);
        setSaved(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("Failed to save scan. Please try again.");
    }
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              GreenCity
            </h1>
          </div>
          <p className="text-lg text-slate-600">
            AI-Powered Waste Sorting & Recycling Guide
          </p>
        </header>

        {/* Impact Tracker */}
        <div className="mb-8">
          <ImpactTracker profile={profile} />
        </div>

        {/* Scanner Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
            Scan Your Waste
          </h2>

          <div className="max-w-md mx-auto mb-6">
            <ImageUpload onImageSelect={handleImageSelect} loading={loading} />
          </div>

          {error && (
            <div className="max-w-md mx-auto mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-700 text-sm text-center">{error}</p>
            </div>
          )}

          {prediction && (
            <div className="space-y-6 animate-fadeIn">
              <PredictionResult prediction={prediction} />
              <RecyclingGuide category={prediction.categoryDetails} />

              {!saved ? (
                <button
                  onClick={handleSaveScan}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Save & Earn {prediction.categoryDetails.points_value ?? 50} Points
                </button>
              ) : (
                <div className="w-full bg-emerald-100 border-2 border-emerald-500 text-emerald-700 font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Saved Successfully!</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
