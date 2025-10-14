import { CheckCircle, TrendingUp } from 'lucide-react';
import type { WastePrediction } from '../types';
import { getIconComponent } from '../utils/iconMapper';

interface PredictionResultProps {
  prediction: WastePrediction;
}

export function PredictionResult({ prediction }: PredictionResultProps) {
  const { category, confidence, categoryDetails } = prediction;
  const IconComponent = getIconComponent(categoryDetails.icon_name);

  const confidencePercentage = (confidence * 100).toFixed(0);

  return (
    <div className="w-full space-y-6">
      <div
        className="rounded-2xl p-6 shadow-lg border-2"
        style={{
          borderColor: categoryDetails.color,
          backgroundColor: `${categoryDetails.color}10`
        }}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: categoryDetails.color }}
          >
            <IconComponent className="w-8 h-8 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-2xl font-bold text-slate-800 capitalize">
                {category}
              </h3>
              <CheckCircle className="w-6 h-6 text-emerald-500" />
            </div>

            <p className="text-sm text-slate-600 mb-3">
              {categoryDetails.description}
            </p>

            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white/50 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${confidencePercentage}%`,
                    backgroundColor: categoryDetails.color,
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-slate-700">
                {confidencePercentage}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-md border border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-medium text-slate-500 uppercase">Points</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">
            +{categoryDetails.points_value}
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md border border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-slate-500 uppercase">CO₂ Saved</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600">
            {categoryDetails.co2_impact_kg} kg
          </p>
        </div>
      </div>
    </div>
  );
}
