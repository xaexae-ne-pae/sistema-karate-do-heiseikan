
import React from 'react';
import { ScoreboardData } from "@/types";
import KataScoreboard from "./KataScoreboard";
import KumiteScoreboard from "./KumiteScoreboard";

interface ScoreboardLayoutProps {
  scoreboardData: ScoreboardData;
  timeLeft: number;
  id?: string;
  senshu: "athlete1" | "athlete2" | null;
}

const ScoreboardLayout = ({ 
  scoreboardData, 
  timeLeft, 
  id, 
  senshu 
}: ScoreboardLayoutProps) => {
  if (scoreboardData.match.type === "kata") {
    return (
      <KataScoreboard 
        scoreboardData={scoreboardData}
        timeLeft={timeLeft}
        id={id}
        kataScore={scoreboardData.kataScore}
      />
    );
  }
  
  return (
    <KumiteScoreboard
      scoreboardData={scoreboardData}
      timeLeft={timeLeft}
      id={id}
      kumiteScore={scoreboardData.kumiteScore}
      senshu={senshu}
    />
  );
};

export default ScoreboardLayout;
