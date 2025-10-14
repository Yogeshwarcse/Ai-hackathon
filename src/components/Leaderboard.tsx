import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import type { UserProfile } from '../types';

interface LeaderboardProps {
  users: UserProfile[];
  currentUserId?: string;
}

export function Leaderboard({ users, currentUserId }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-amber-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-slate-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-700" />;
      default:
        return <span className="text-lg font-bold text-slate-500">{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-300';
      case 2:
        return 'bg-gradient-to-r from-slate-50 to-gray-50 border-slate-300';
      case 3:
        return 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-300';
      default:
        return 'bg-white border-slate-200';
    }
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500">No users on the leaderboard yet</p>
        <p className="text-sm text-slate-400 mt-2">Be the first to scan waste items!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {users.map((user, index) => {
        const rank = index + 1;
        const isCurrentUser = user.id === currentUserId;

        return (
          <div
            key={user.id}
            className={`
              rounded-xl p-4 border-2 transition-all
              ${getRankColor(rank)}
              ${isCurrentUser ? 'ring-2 ring-emerald-500 ring-offset-2' : ''}
            `}
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                {getRankIcon(rank)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-slate-800 truncate">
                    {user.username}
                  </h3>
                  {isCurrentUser && (
                    <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs font-medium rounded-full">
                      You
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-slate-700">
                      {user.total_points.toLocaleString()} pts
                    </span>
                  </div>
                  <span className="text-slate-500">
                    {user.total_scans} scans
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-slate-600 mb-1">CO₂ Saved</div>
                <div className="text-lg font-bold text-emerald-600">
                  {user.co2_saved_kg.toFixed(1)} kg
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
