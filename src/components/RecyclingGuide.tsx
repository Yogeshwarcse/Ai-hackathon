import { AlertCircle, Info, Leaf } from 'lucide-react';
import type { WasteCategory } from '../types';

interface RecyclingGuideProps {
  category: WasteCategory;
}

export function RecyclingGuide({ category }: RecyclingGuideProps) {
  return (
    <div className="w-full space-y-4">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Info className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            Disposal Instructions
          </h3>
        </div>
        <p className="text-slate-700 leading-relaxed">
          {category.disposal_instructions}
        </p>
      </div>

      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 shadow-lg border border-emerald-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            Environmental Impact
          </h3>
        </div>
        <p className="text-slate-700 leading-relaxed">
          {category.environmental_impact}
        </p>
      </div>

      <div className="bg-amber-50 rounded-2xl p-6 shadow-lg border border-amber-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-900 mb-1">
              Important Reminder
            </h4>
            <p className="text-sm text-amber-800">
              Always check your local recycling guidelines as they may vary by location.
              When in doubt, contact your local waste management facility.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
