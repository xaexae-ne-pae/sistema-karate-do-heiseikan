
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Trophy, User, Crown, Clock } from "lucide-react";
import { MatchData, KataScore, KumiteScore, ScoreboardData } from "@/types";

const Scoreboard = () => {
  const { id } = useParams<{ id: string }>();
  const [scoreboardData, setScoreboardData] = useState<ScoreboardData | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(180);
  const [kataScore, setKataScore] = useState<KataScore | null>(null);
  const [kumiteScore, setKumiteScore] = useState<KumiteScore | null>(null);
  
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

    return () => {
      window.removeEventListener("scoreboardUpdate", handleUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
      clearInterval(checkInterval);
    };
  }, [timeLeft, kataScore, kumiteScore]);
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  
  const calculateKataTotal = (kataScore: KataScore): number => {
    return kataScore.judge1 + kataScore.judge2 + kataScore.judge3;
  };
  
  const calculateKumitePoints = (athlete: "athlete1" | "athlete2", kumiteScore: KumiteScore): number => {
    const scores = kumiteScore[athlete];
    return scores.yuko + scores.wazari * 2 + scores.ippon * 3 - scores.penalties;
  };
  
  const determineWinner = (match: MatchData, kumiteScore: KumiteScore): string | null => {
    if (!match || match.type !== "kumite") return null;

    const athlete1 = kumiteScore.athlete1;
    const athlete2 = kumiteScore.athlete2;

    if (athlete1.hansoku > 0 || athlete1.shikkaku > 0)
      return match.athlete2;
    if (athlete2.hansoku > 0 || athlete2.shikkaku > 0)
      return match.athlete1;

    const athlete1Score = calculateKumitePoints("athlete1", kumiteScore);
    const athlete2Score = calculateKumitePoints("athlete2", kumiteScore);

    if (athlete1Score > athlete2Score) return match.athlete1;
    if (athlete2Score > athlete1Score) return match.athlete2;

    return null;
  };
  
  if (!scoreboardData) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        <p className="text-xl">Carregando dados do placar...</p>
      </div>
    );
  }
  
  if (scoreboardData.match.type === "kata") {
    return <KataScoreboard 
      scoreboardData={scoreboardData} 
      formatTime={formatTime} 
      calculateKataTotal={calculateKataTotal} 
      timeLeft={timeLeft} 
      id={id}
      kataScore={kataScore || scoreboardData.kataScore}
    />;
  }
  
  return <KumiteScoreboard 
    scoreboardData={scoreboardData} 
    formatTime={formatTime} 
    calculateKumitePoints={calculateKumitePoints}
    determineWinner={determineWinner}
    timeLeft={timeLeft}
    id={id}
    kumiteScore={kumiteScore || scoreboardData.kumiteScore}
  />;
};

const KataScoreboard = ({ 
  scoreboardData, 
  formatTime, 
  calculateKataTotal, 
  timeLeft,
  id,
  kataScore
}: { 
  scoreboardData: ScoreboardData, 
  formatTime: (seconds: number) => string,
  calculateKataTotal: (kataScore: KataScore) => number,
  timeLeft: number,
  id: string | undefined,
  kataScore: KataScore | null
}) => (
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
      
      {kataScore && (
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
      )}
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

const KumiteScoreboard = ({ 
  scoreboardData, 
  formatTime, 
  calculateKumitePoints,
  determineWinner,
  timeLeft,
  id,
  kumiteScore
}: { 
  scoreboardData: ScoreboardData, 
  formatTime: (seconds: number) => string,
  calculateKumitePoints: (athlete: "athlete1" | "athlete2", kumiteScore: KumiteScore) => number,
  determineWinner: (match: MatchData, kumiteScore: KumiteScore) => string | null,
  timeLeft: number,
  id: string | undefined,
  kumiteScore: KumiteScore | null
}) => {
  const isMatchEnded = timeLeft === 0;
  const athlete1Points = kumiteScore ? calculateKumitePoints("athlete1", kumiteScore) : 0;
  const athlete2Points = kumiteScore ? calculateKumitePoints("athlete2", kumiteScore) : 0;
  const showCrownAthlete1 = !isMatchEnded && athlete1Points > athlete2Points;
  const showCrownAthlete2 = !isMatchEnded && athlete2Points > athlete1Points;
  const winner = kumiteScore ? determineWinner(scoreboardData.match, kumiteScore) : null;
  const showWinnerBadge = isMatchEnded || (kumiteScore && (kumiteScore.athlete1.hansoku > 0 || kumiteScore.athlete1.shikkaku > 0 || kumiteScore.athlete2.hansoku > 0 || kumiteScore.athlete2.shikkaku > 0));

  return (
    <div className="flex flex-col h-screen bg-[#0A1128] text-white">
      <header className="border-b border-white/10 p-6">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          {scoreboardData.match.category}
        </h1>
      </header>

      <main className="flex-1 grid grid-cols-2 gap-8 p-8">
        {kumiteScore && (
          <>
            <div className="relative">
              <div className={`rounded-2xl p-8 h-full flex flex-col items-center justify-center ${showCrownAthlete1 || (showWinnerBadge && winner === scoreboardData.match.athlete1) ? 'bg-blue-500/10 border-2 border-blue-500/30' : 'bg-[#111A2F]/80 border border-white/10'}`}>
                {(showCrownAthlete1 || (showWinnerBadge && winner === scoreboardData.match.athlete1)) && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <Crown className="h-12 w-12 text-amber-400 drop-shadow-lg" />
                  </div>
                )}
                
                <div className="w-32 h-32 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 border border-blue-500/30">
                  <User className="h-16 w-16 text-blue-400" />
                </div>
                
                <h2 className="text-3xl font-bold mb-6 text-blue-100">{scoreboardData.match.athlete1}</h2>
                
                {showWinnerBadge && winner === scoreboardData.match.athlete1 && (
                  <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-bold mb-4">
                    Vencedor
                  </div>
                )}

                <div className="bg-blue-500/10 rounded-xl p-6 w-full border border-blue-500/20">
                  <div className="text-center mb-6">
                    <span className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                      {calculateKumitePoints("athlete1", kumiteScore)}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-blue-300 mb-2">Yuko</p>
                      <div className="bg-blue-500/10 rounded-lg py-2 border border-blue-500/20">
                        <p className="text-2xl font-bold text-blue-100">{kumiteScore.athlete1.yuko}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-blue-300 mb-2">Waza-ari</p>
                      <div className="bg-blue-500/10 rounded-lg py-2 border border-blue-500/20">
                        <p className="text-2xl font-bold text-blue-100">{kumiteScore.athlete1.wazari}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-blue-300 mb-2">Ippon</p>
                      <div className="bg-blue-500/10 rounded-lg py-2 border border-blue-500/20">
                        <p className="text-2xl font-bold text-blue-100">{kumiteScore.athlete1.ippon}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className={`rounded-2xl p-8 h-full flex flex-col items-center justify-center ${showCrownAthlete2 || (showWinnerBadge && winner === scoreboardData.match.athlete2) ? 'bg-blue-500/10 border-2 border-blue-500/30' : 'bg-[#111A2F]/80 border border-white/10'}`}>
                {(showCrownAthlete2 || (showWinnerBadge && winner === scoreboardData.match.athlete2)) && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <Crown className="h-12 w-12 text-amber-400 drop-shadow-lg" />
                  </div>
                )}
                
                <div className="w-32 h-32 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 border border-blue-500/30">
                  <User className="h-16 w-16 text-blue-400" />
                </div>
                
                <h2 className="text-3xl font-bold mb-6 text-blue-100">{scoreboardData.match.athlete2}</h2>
                
                {showWinnerBadge && winner === scoreboardData.match.athlete2 && (
                  <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-bold mb-4">
                    Vencedor
                  </div>
                )}

                <div className="bg-blue-500/10 rounded-xl p-6 w-full border border-blue-500/20">
                  <div className="text-center mb-6">
                    <span className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                      {calculateKumitePoints("athlete2", kumiteScore)}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-blue-300 mb-2">Yuko</p>
                      <div className="bg-blue-500/10 rounded-lg py-2 border border-blue-500/20">
                        <p className="text-2xl font-bold text-blue-100">{kumiteScore.athlete2.yuko}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-blue-300 mb-2">Waza-ari</p>
                      <div className="bg-blue-500/10 rounded-lg py-2 border border-blue-500/20">
                        <p className="text-2xl font-bold text-blue-100">{kumiteScore.athlete2.wazari}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-blue-300 mb-2">Ippon</p>
                      <div className="bg-blue-500/10 rounded-lg py-2 border border-blue-500/20">
                        <p className="text-2xl font-bold text-blue-100">{kumiteScore.athlete2.ippon}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="border-t border-white/10 p-6">
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

export default Scoreboard;
