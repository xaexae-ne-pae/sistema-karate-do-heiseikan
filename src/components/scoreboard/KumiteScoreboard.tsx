
import React from 'react';
import { Clock, Trophy } from "lucide-react";
import { KumiteScore, ScoreboardData } from "@/types";
import { formatTime } from "@/utils/scoreboardUtils";
import KumiteAthleteDisplay from "./KumiteAthleteDisplay";

interface KumiteScoreboardProps {
  scoreboardData: ScoreboardData;
  timeLeft: number;
  id: string | undefined;
  kumiteScore: KumiteScore | null;
  senshu: "athlete1" | "athlete2" | null;
}

const KumiteScoreboard = ({ 
  scoreboardData, 
  timeLeft,
  id,
  kumiteScore,
  senshu
}: KumiteScoreboardProps) => {
  if (!kumiteScore) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl text-white/70">Aguardando pontuação...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <header className="border-b border-slate-700/50 pb-4 mb-6 p-6">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          {scoreboardData.match.category} - Kumite
        </h1>
      </header>

      <main className="flex-1 px-8">
        <div className="grid grid-cols-2 gap-8 h-full">
          <KumiteAthleteDisplay 
            athlete="athlete1"
            athleteName={scoreboardData.match.athlete1}
            kumiteScore={kumiteScore}
            hasSenshu={senshu === "athlete1"}
            colorScheme="blue"
          />
          
          <KumiteAthleteDisplay 
            athlete="athlete2"
            athleteName={scoreboardData.match.athlete2 || ""}
            kumiteScore={kumiteScore}
            hasSenshu={senshu === "athlete2"}
            colorScheme="red"
          />
        </div>
      </main>

      <footer className="border-t border-slate-700/50 p-6">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <div className="flex items-center">
            <Trophy className="h-6 w-6 text-blue-400 mr-2" />
            <span className="text-2xl text-blue-200">Torneio #{id}</span>
          </div>
          <div className="flex items-center bg-slate-800/80 px-4 py-2 rounded-lg border border-slate-700">
            <Clock className="h-6 w-6 text-blue-400 mr-2" />
            <span className={`text-3xl font-mono ${timeLeft <= 10 ? "text-red-400 animate-pulse" : "text-blue-200"}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default KumiteScoreboard;
