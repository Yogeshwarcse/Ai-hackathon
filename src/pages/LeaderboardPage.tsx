import { useEffect, useState } from 'react';
import { Trophy, ArrowLeft } from 'lucide-react';
import { Leaderboard } from '../components/Leaderboard';
import { wasteApi } from '../api/wasteApi';
import { useAuth } from '../context/AuthContext';
import type { UserProfile } from '../types';

interface LeaderboardPageProps {
  onBack: () => void;
}

export function LeaderboardPage({ onBack }: LeaderboardPageProps) {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number>(0);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const data = await wasteApi.getLeaderboard(100);
      setUsers(data);

      if (user) {
        const rank = await wasteApi.getUserRank(user.id);
        setUserRank(rank);
      }
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Scanner</span>
        </button>

        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Community Leaderboard
            </h1>
          </div>
          <p className="text-lg text-slate-600">
            Top environmental champions making a difference
          </p>
        </header>

        {userRank > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-emerald-200">
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-1">Your Current Rank</p>
              <p className="text-4xl font-bold text-emerald-600">#{userRank}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-slate-600">Loading leaderboard...</p>
            </div>
          ) : (
            <Leaderboard users={users} currentUserId={user?.id} />
          )}
        </div>
      </div>
    </div>
  );
}
