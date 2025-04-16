
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ScoreboardData } from "@/types";
import { isTie, updateSenshu } from "@/utils/scoreboardUtils";
import ScoreboardLayout from "@/components/scoreboard/ScoreboardLayout";

const Scoreboard = () => {
  const { id } = useParams<{ id: string }>();
  const [scoreboardData, setScoreboardData] = useState<ScoreboardData | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(180);
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
            
            // Load Senshu state from localStorage if available
            if (parsedData.senshu !== undefined) {
              setSenshu(parsedData.senshu);
              if (parsedData.senshu) {
                setFirstPointScored(true);
              }
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

    return () => {
      window.removeEventListener("scoreboardUpdate", handleUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
      clearInterval(checkInterval);
    };
  }, [timeLeft]);

  // Update Senshu logic when kumite scores change
  useEffect(() => {
    if (!scoreboardData || !scoreboardData.kumiteScore || scoreboardData.match.type !== "kumite") {
      return;
    }
    
    const updatedSenshu = updateSenshu(
      scoreboardData.kumiteScore, 
      senshu, 
      firstPointScored
    );
    
    if (updatedSenshu !== senshu) {
      setSenshu(updatedSenshu);
      
      if (updatedSenshu && !firstPointScored) {
        setFirstPointScored(true);
        
        // Also update the senshu in localStorage for persistence
        const storageData = localStorage.getItem("scoreboardData");
        if (storageData) {
          const parsedData = JSON.parse(storageData) as ScoreboardData;
          parsedData.senshu = updatedSenshu;
          localStorage.setItem("scoreboardData", JSON.stringify(parsedData));
        }
      }
    }
  }, [scoreboardData, senshu, firstPointScored]);
  
  if (!scoreboardData) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        <p className="text-xl">Carregando dados do placar...</p>
      </div>
    );
  }

  return (
    <ScoreboardLayout
      scoreboardData={scoreboardData}
      timeLeft={timeLeft}
      id={id}
      senshu={senshu}
    />
  );
};

export default Scoreboard;
