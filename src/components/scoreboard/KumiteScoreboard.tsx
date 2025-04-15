
import React from 'react';
import { Clock, Crown, Trophy, User } from "lucide-react";
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
    <div className="min-h-screen bg-[#0A1128] relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ 
          backgroundImage: 'url("/karate-background.jpg")', 
          backgroundBlendMode: 'overlay' 
        }}
      />
      
      <div className="relative z-10 min-h-screen">
        <header className="border-b border-white/10 pb-4 pt-6 px-8">
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            {scoreboardData.match.category} - Kumite
          </h1>
        </header>

        <main className="px-8 py-6">
          <div className="grid grid-cols-2 gap-8">
            {/* Athlete 1 */}
            <div className="relative">
              <div className={`rounded-2xl p-8 backdrop-blur-md bg-blue-900/20 border-2 ${
                senshu === "athlete1" ? 'border-blue-500' : 'border-blue-500/20'
              } transition-all duration-300`}>
                {(senshu === "athlete1" || showCrownAthlete1) && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <Crown className="h-14 w-14 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                  </div>
                )}
                
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-28 h-28 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500/30 to-blue-600/30 border-2 border-blue-400/30">
                    <User className="h-14 w-14 text-blue-400" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-blue-100">
                    {scoreboardData.match.athlete1}
                  </h2>

                  <div className="w-full bg-blue-900/30 rounded-xl p-6 backdrop-blur-sm border border-blue-500/20">
                    <div className="text-center mb-4">
                      <span className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                        {athlete1Points}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Athlete 2 */}
            <div className="relative">
              <div className={`rounded-2xl p-8 backdrop-blur-md bg-red-900/20 border-2 ${
                senshu === "athlete2" ? 'border-red-500' : 'border-red-500/20'
              } transition-all duration-300`}>
                {(senshu === "athlete2" || showCrownAthlete2) && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <Crown className="h-14 w-14 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                  </div>
                )}
                
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-28 h-28 rounded-full flex items-center justify-center bg-gradient-to-br from-red-500/30 to-red-600/30 border-2 border-red-400/30">
                    <User className="h-14 w-14 text-red-400" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-red-100">
                    {scoreboardData.match.athlete2}
                  </h2>

                  <div className="w-full bg-red-900/30 rounded-xl p-6 backdrop-blur-sm border border-red-500/20">
                    <div className="text-center mb-4">
                      <span className="text-6xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                        {athlete2Points}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="fixed bottom-0 left-0 right-0 border-t border-white/10 p-6 backdrop-blur-md bg-[#0A1128]/80">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center space-x-2">
              <Trophy className="h-6 w-6 text-blue-400" />
              <span className="text-2xl text-blue-200">Torneio #{id}</span>
            </div>
            <div className="flex items-center space-x-3 bg-[#111A2F]/80 px-6 py-3 rounded-lg border border-blue-500/20">
              <Clock className="h-6 w-6 text-blue-400" />
              <span className={`text-3xl font-mono ${timeLeft <= 10 ? "text-red-400 animate-pulse" : "text-blue-200"}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
