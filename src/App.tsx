import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthForm } from './components/AuthForm';
import { Home } from './pages/Home';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { Trophy, Home as HomeIcon, LogOut } from 'lucide-react';

function AppContent() {
  const { user, profile, loading, signOut } = useAuth();
  const [currentPage, setCurrentPage] = useState<'home' | 'leaderboard'>('home');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading GreenCity...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen">
      {currentPage === 'home' ? (
        <>
          <Home />
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="flex items-center justify-around py-4">
                <button
                  onClick={() => setCurrentPage('home')}
                  className="flex flex-col items-center gap-1 text-emerald-600"
                >
                  <HomeIcon className="w-6 h-6" />
                  <span className="text-xs font-semibold">Scanner</span>
                </button>

                <button
                  onClick={() => setCurrentPage('leaderboard')}
                  className="flex flex-col items-center gap-1 text-slate-600 hover:text-amber-600 transition-colors"
                >
                  <Trophy className="w-6 h-6" />
                  <span className="text-xs font-medium">Leaderboard</span>
                </button>

                <button
                  onClick={signOut}
                  className="flex flex-col items-center gap-1 text-slate-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-6 h-6" />
                  <span className="text-xs font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <LeaderboardPage onBack={() => setCurrentPage('home')} />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
