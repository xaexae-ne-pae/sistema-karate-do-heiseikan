
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { KataScore, KumiteScore, ScoreboardData } from "@/types";
import { KataScoreboard } from '@/components/scoreboard/KataScoreboard';
import { KumiteScoreboard } from '@/components/scoreboard/KumiteScoreboard';

const Scoreboard = () => {
  const { id } = useParams<{ id: string }>();
  const [scoreboardData, setScoreboardData] = useState<ScoreboardData | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(180);
  const [kataScore, setKataScore] = useState<KataScore | null>(null);
  const [kumiteScore, setKumiteScore] = useState<KumiteScore | null>(null);
  const [senshu, setSenshu] = useState<"athlete1" | "athlete2" | null>(null);
  const [firstPointScored, setFirstPointScored] = useState(false);

  useEffect(() => {
    const loadScoreboardData = () => {
      try {
        const data = localStorage.getItem("scoreboardData");
        if (data) {
          const parsedData = JSON.parse(data) as ScoreboardData;
          
          if (parsedData && parsedData.match) {
            setScoreboardData(parsedData);
            
            if (parsedData.timeLeft !== undefined) {
              setTimeLeft(parsedData.timeLeft);
            }
            
            if (parsedData.kataScore && (!kataScore || 
                JSON.stringify(kataScore) !== JSON.stringify(parsedData.kataScore))) {
              setKataScore(parsedData.kataScore);
            }
            
            if (parsedData.kumiteScore && (!kumiteScore ||
                JSON.stringify(kumiteScore) !== JSON.stringify(parsedData.kumiteScore))) {
              setKumiteScore(parsedData.kumiteScore);
            }
          }
        }
      } catch (error) {
        console.error("Erro ao analisar dados do placar:", error);
      }
    };

    loadScoreboardData();

    const handleUpdate = () => {
      loadScoreboardData();
    };

    window.addEventListener("scoreboardUpdate", handleUpdate);
    
    const handleStorageUpdate = (event: StorageEvent) => {
      if (event.key === "scoreboardData") {
        loadScoreboardData();
      }
    };
    
    window.addEventListener("storage", handleStorageUpdate);

    const checkInterval = setInterval(() => {
      const data = localStorage.getItem("scoreboardData");
      if (data) {
        try {
          const parsedData = JSON.parse(data) as ScoreboardData;
          if (timeLeft !== parsedData.timeLeft) {
            setTimeLeft(parsedData.timeLeft);
          }
        } catch (error) {
          console.error("Erro ao verificar atualizações de tempo:", error);
        }
      }
    }, 200);

    document.title = "Placar - Karate Tournament";

    const data = localStorage.getItem("scoreboardData");
    if (data) {
      const parsedData = JSON.parse(data) as ScoreboardData;
      if (parsedData.senshu) {
        setSenshu(parsedData.senshu);
        setFirstPointScored(true);
      }
    }

    return () => {
      window.removeEventListener("scoreboardUpdate", handleUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
      clearInterval(checkInterval);
    };
  }, [timeLeft, kataScore, kumiteScore]);

  if (!scoreboardData) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        <p className="text-xl">Carregando dados do placar....</p>
      </div>
    );
  }

  if (scoreboardData.match.type.toString() === "kata") {
    return (
      <KataScoreboard 
        scoreboardData={scoreboardData}
        timeLeft={timeLeft}
        id={id}
        kataScore={kataScore || scoreboardData.kataScore}
      />
    );
  }

  return (
    <KumiteScoreboard
      scoreboardData={scoreboardData}
      kumiteScore={kumiteScore || scoreboardData.kumiteScore}
      timeLeft={timeLeft}
      id={id}
      senshu={senshu}
    />
  );
};

export default Scoreboard;
