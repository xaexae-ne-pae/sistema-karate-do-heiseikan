
import React from 'react';
import { Crown, Star, User, CircleEqual } from "lucide-react";
import { KumiteScore } from "@/types";
import { calculateKumitePoints } from "@/utils/scoreboardUtils";

interface KumiteAthleteDisplayProps {
  athlete: "athlete1" | "athlete2";
  athleteName: string;
  kumiteScore: KumiteScore;
  hasSenshu: boolean;
  isLeading: boolean;
  colorScheme: "blue" | "red";
}

const KumiteAthleteDisplay = ({
  athlete,
  athleteName,
  kumiteScore,
  hasSenshu,
  isLeading,
  colorScheme
}: KumiteAthleteDisplayProps) => {
  const baseColor = colorScheme === "blue" ? "blue" : "red";
  const points = calculateKumitePoints(athlete, kumiteScore);

  return (
    <div className="relative">
      <div className={`rounded-2xl p-8 h-full flex flex-col items-center justify-center bg-gradient-to-br ${
        hasSenshu || isLeading
          ? `from-${baseColor}-900/40 to-${baseColor}-800/40` 
          : `from-${baseColor}-900/20 to-${baseColor}-800/20`
      } border-2 ${hasSenshu || isLeading ? `border-${baseColor}-500` : `border-${baseColor}-500/20`}`}>
        
        {isLeading && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 animate-bounce">
            <Crown className="h-8 w-8 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
          </div>
        )}
        
        <div className={`w-28 h-28 bg-${baseColor}-500/20 rounded-full flex items-center justify-center mb-4 border-2 border-${baseColor}-400/30`}>
          <User className={`h-14 w-14 text-${baseColor}-400`} />
        </div>
        
        <h2 className={`text-2xl font-bold mb-4 text-${baseColor}-100`}>
          {athleteName}
        </h2>

        {hasSenshu && (
          <div className={`absolute top-4 ${colorScheme === 'blue' ? 'left-4' : 'right-4'} flex items-center gap-2 bg-amber-500/20 px-3 py-1.5 rounded-full border border-amber-500/30`}>
            <Star className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-semibold text-amber-300">Senshu</span>
          </div>
        )}

        <div className={`bg-${baseColor}-500/10 rounded-xl p-6 w-full border border-${baseColor}-500/20`}>
          <div className="text-center mb-6">
            <span className={`text-6xl font-bold text-${baseColor}-400`}>
              {points}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KumiteAthleteDisplay;
