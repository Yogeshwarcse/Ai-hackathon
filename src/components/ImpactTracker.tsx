import { Leaf, TrendingUp, Scan, TreePine } from 'lucide-react';
import type { UserProfile } from '../types';

interface ImpactTrackerProps {
  profile: UserProfile;
}

export function ImpactTracker({ profile }: ImpactTrackerProps) {
  const stats = [
    {
      icon: Scan,
      label: 'Total Scans',
      value: profile.total_scans.toLocaleString(),
      color: 'bg-blue-500',
      gradient: 'from-blue-50 to-blue-100',
    },
    {
      icon: TrendingUp,
      label: 'Points Earned',
      value: profile.total_points.toLocaleString(),
      color: 'bg-amber-500',
      gradient: 'from-amber-50 to-amber-100',
    },
    {
      icon: Leaf,
      label: 'CO₂ Saved',
      value: `${profile.co2_saved_kg.toFixed(1)} kg`,
      color: 'bg-emerald-500',
      gradient: 'from-emerald-50 to-emerald-100',
    },
    {
      icon: TreePine,
      label: 'Trees Equivalent',
      value: profile.trees_saved.toFixed(2),
      color: 'bg-green-600',
      gradient: 'from-green-50 to-green-100',
    },
  ];

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Your Environmental Impact
        </h2>
        <p className="text-slate-600">
          Track your positive contribution to the planet
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={stat.label}
              className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-6 shadow-lg border border-slate-200`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 uppercase tracking-wide mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-slate-800">
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-6 border border-teal-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
            <TreePine className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 mb-2">
              Keep Up the Great Work!
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              Every item you recycle correctly helps reduce landfill waste and greenhouse gas emissions.
              Your actions are making a real difference for our planet's future.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
