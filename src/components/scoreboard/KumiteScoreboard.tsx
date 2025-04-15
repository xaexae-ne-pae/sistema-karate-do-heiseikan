
import React from 'react';
import { Clock, Trophy, User, Crown } from "lucide-react";
import { KumiteScore, ScoreboardData } from "@/types";
import { formatTime, calculateKumitePoints } from "@/utils/scoreboardUtils";

interface KumiteScoreboardProps {
  scoreboardData: ScoreboardData;
  kumiteScore: KumiteScore | null;
  timeLeft: number;
  id: string | undefined;
  senshu: "athlete1" | "athlete2" | null;
}

export const KumiteScoreboard = ({
  scoreboardData,
  kumiteScore,
  timeLeft,
  id,
  senshu
}: KumiteScoreboardProps) => {
  if (!kumiteScore) return null;

  const athlete1Points = calculateKumitePoints("athlete1", kumiteScore);
  const athlete2Points = calculateKumitePoints("athlete2", kumiteScore);
  const showCrownAthlete1 = athlete1Points > athlete2Points;
  const showCrownAthlete2 = athlete2Points > athlete1Points;

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2072&auto=format&fit=crop")',
          backgroundBlendMode: 'overlay'
        }}
      />
      
      {/* Diagonal gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A]/90 via-transparent to-red-900/30" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="py-8 px-4">
          <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent animate-pulse-gentle">
            {scoreboardData.match.category}
          </h1>
        </header>

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="grid grid-cols-[1fr_auto_1fr] gap-8 w-full max-w-7xl">
            {/* Athlete 1 */}
            <div className={`relative transform transition-all duration-500 ${showCrownAthlete1 ? 'scale-105' : ''}`}>
              <div className={`rounded-3xl p-8 backdrop-blur-xl ${
                senshu === "athlete1" 
                  ? 'bg-red-950/40 border-2 border-red-500/50' 
                  : 'bg-slate-950/40 border border-white/10'
              }`}>
                <div className="space-y-6">
                  {/* Crown for winning athlete */}
                  {showCrownAthlete1 && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 animate-bounce">
                      <Crown className="h-8 w-8 text-yellow-400" />
                    </div>
                  )}
                  
                  {/* Senshu indicator */}
                  {senshu === "athlete1" && (
                    <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                      Senshu
                    </div>
                  )}

                  <div className="flex justify-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-red-500/20 to-slate-900/20 border-2 border-red-500/20 flex items-center justify-center">
                      <User className={`h-16 w-16 ${senshu === "athlete1" ? 'text-red-400' : 'text-slate-400'}`} />
                    </div>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-center text-white mb-6">
                    {scoreboardData.match.athlete1}
                  </h2>

                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent blur-xl" />
                    <div className="relative bg-black/30 rounded-2xl p-6 border border-red-500/20">
                      <div className="text-center">
                        <span className={`text-8xl font-bold ${
                          showCrownAthlete1 
                            ? 'bg-gradient-to-r from-red-400 to-orange-300'
                            : 'text-white'
                        } bg-clip-text text-transparent`}>
                          {athlete1Points}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Center divider with timer */}
            <div className="flex flex-col items-center justify-center space-y-8">
              <div className="w-px h-32 bg-gradient-to-b from-transparent via-red-500/50 to-transparent" />
              <div className="backdrop-blur-lg bg-black/30 px-8 py-4 rounded-full border border-red-500/20">
                <div className="flex items-center space-x-3">
                  <Clock className="h-8 w-8 text-red-400" />
                  <span className={`text-4xl font-mono font-bold ${
                    timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-white'
                  }`}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
              <div className="w-px h-32 bg-gradient-to-b from-red-500/50 via-transparent to-transparent" />
            </div>

            {/* Athlete 2 */}
            <div className={`relative transform transition-all duration-500 ${showCrownAthlete2 ? 'scale-105' : ''}`}>
              <div className={`rounded-3xl p-8 backdrop-blur-xl ${
                senshu === "athlete2"
                  ? 'bg-red-950/40 border-2 border-red-500/50'
                  : 'bg-slate-950/40 border border-white/10'
              }`}>
                <div className="space-y-6">
                  {/* Crown for winning athlete */}
                  {showCrownAthlete2 && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 animate-bounce">
                      <Crown className="h-8 w-8 text-yellow-400" />
                    </div>
                  )}
                  
                  {/* Senshu indicator */}
                  {senshu === "athlete2" && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                      Senshu
                    </div>
                  )}

                  <div className="flex justify-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-red-500/20 to-slate-900/20 border-2 border-red-500/20 flex items-center justify-center">
                      <User className={`h-16 w-16 ${senshu === "athlete2" ? 'text-red-400' : 'text-slate-400'}`} />
                    </div>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-center text-white mb-6">
                    {scoreboardData.match.athlete2}
                  </h2>

                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent blur-xl" />
                    <div className="relative bg-black/30 rounded-2xl p-6 border border-red-500/20">
                      <div className="text-center">
                        <span className={`text-8xl font-bold ${
                          showCrownAthlete2
                            ? 'bg-gradient-to-r from-red-400 to-orange-300'
                            : 'text-white'
                        } bg-clip-text text-transparent`}>
                          {athlete2Points}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 px-8">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center space-x-3">
              <Trophy className="h-6 w-6 text-red-400" />
              <span className="text-2xl text-white/80">Torneio #{id}</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
