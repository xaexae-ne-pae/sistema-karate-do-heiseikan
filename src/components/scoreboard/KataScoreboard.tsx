
import React from 'react';
import { Clock, Trophy, User } from "lucide-react";
import { KataScore, ScoreboardData } from "@/types";
import { calculateKataTotal, formatTime } from "@/utils/scoreboardUtils";

interface KataScoreboardProps {
  scoreboardData: ScoreboardData;
  timeLeft: number;
  id: string | undefined;
  kataScore: KataScore | null;
}

const KataScoreboard = ({ 
  scoreboardData, 
  timeLeft,
  id,
  kataScore
}: KataScoreboardProps) => {
  if (!kataScore) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl text-blue-300">Aguardando pontuação...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0A1128] text-white p-4">
      <header className="border-b border-white/10 pb-4 mb-6">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          {scoreboardData.match.category} - Kata
        </h1>
      </header>
      
      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="text-center mb-8">
          <div className="w-32 h-32 bg-blue-500/20 rounded-full mx-auto flex items-center justify-center mb-4 border border-blue-500/30 shadow-lg shadow-blue-500/10">
            <User className="h-16 w-16 text-blue-400" />
          </div>
          <h2 className="text-5xl font-bold mb-2 text-blue-100">{scoreboardData.match.athlete1}</h2>
        </div>
        
        <div className="bg-[#111A2F]/80 backdrop-blur-sm rounded-xl p-8 w-full max-w-2xl border border-blue-500/10 shadow-xl">
          <div className="grid grid-cols-3 gap-8 mb-8">
            {[
              { label: "Jurado 1", score: kataScore.judge1 },
              { label: "Jurado 2", score: kataScore.judge2 },
              { label: "Jurado 3", score: kataScore.judge3 },
            ].map((judge, index) => (
              <div key={index} className="text-center">
                <p className="text-xl mb-2 text-blue-300">{judge.label}</p>
                <div className="bg-blue-500/10 rounded-lg py-3 border border-blue-500/20">
                  <p className="text-4xl font-bold text-blue-100">{judge.score.toFixed(1)}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-2xl mb-2 text-blue-300">Pontuação Total</p>
            <div className="bg-blue-500/20 rounded-lg py-4 border border-blue-500/30">
              <p className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                {calculateKataTotal(kataScore).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="border-t border-white/10 pt-4 mt-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Trophy className="h-6 w-6 text-blue-400 mr-2" />
            <span className="text-2xl text-blue-200">Torneio #{id}</span>
          </div>
          <div className="flex items-center bg-[#111A2F] px-4 py-2 rounded-lg border border-blue-500/20">
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

export default KataScoreboard;
