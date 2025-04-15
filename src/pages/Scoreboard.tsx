
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Trophy, User, Crown, Clock, Star } from "lucide-react";
import { MatchData, KataScore, KumiteScore, ScoreboardData, MatchType } from "@/types";

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

    // Adicionar lógica para carregar o estado do Senshu
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

  // Atualizar a função calculateKumitePoints para considerar o Senshu
  const calculateKumitePoints = (athlete: "athlete1" | "athlete2"): number => {
    if (!kumiteScore) return 0;
    const scores = kumiteScore[athlete];
    return scores.yuko + scores.wazari * 2 + scores.ippon * 3 - scores.penalties;
  };

  // Lógica do Senshu
  useEffect(() => {
    if (!kumiteScore || firstPointScored) return;

    const athlete1Points = calculateKumitePoints("athlete1");
    const athlete2Points = calculateKumitePoints("athlete2");

    if (athlete1Points > 0 && !senshu) {
      setSenshu("athlete1");
      setFirstPointScored(true);
    } else if (athlete2Points > 0 && !senshu) {
      setSenshu("athlete2");
      setFirstPointScored(true);
    }
  }, [kumiteScore, firstPointScored, senshu]);

  // Atualizar a lógica de perda do Senshu
  useEffect(() => {
    if (!kumiteScore || !senshu) return;

    const athlete1Points = calculateKumitePoints("athlete1");
    const athlete2Points = calculateKumitePoints("athlete2");

    if (senshu === "athlete1" && athlete2Points > athlete1Points) {
      setSenshu(null);
    } else if (senshu === "athlete2" && athlete1Points > athlete2Points) {
      setSenshu(null);
    }
  }, [kumiteScore, senshu]);

  const determineWinner = (): string | null => {
    if (!scoreboardData || scoreboardData.match.type !== "kumite") return null;

    const athlete1 = kumiteScore?.athlete1;
    const athlete2 = kumiteScore?.athlete2;

    if (!athlete1 || !athlete2) return null;

    if (athlete1.hansoku > 0 || athlete1.shikkaku > 0)
      return scoreboardData.match.athlete2 || null;
    if (athlete2.hansoku > 0 || athlete2.shikkaku > 0)
      return scoreboardData.match.athlete1;

    const athlete1Points = calculateKumitePoints("athlete1");
    const athlete2Points = calculateKumitePoints("athlete2");

    if (athlete1Points > athlete2Points) return scoreboardData.match.athlete1;
    if (athlete2Points > athlete1Points) return scoreboardData.match.athlete2;
    
    // Se empatar e tiver Senshu, o atleta com Senshu vence
    if (athlete1Points === athlete2Points) {
      if (senshu === "athlete1") return scoreboardData.match.athlete1;
      if (senshu === "athlete2") return scoreboardData.match.athlete2;
    }

    return null;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  
  const calculateKataTotal = (kataScore: KataScore): number => {
    return kataScore.judge1 + kataScore.judge2 + kataScore.judge3;
  };
  
  const calculateKumitePointsOriginal = (athlete: "athlete1" | "athlete2", kumiteScore: KumiteScore): number => {
    const scores = kumiteScore[athlete];
    return scores.yuko + scores.wazari * 2 + scores.ippon * 3 - scores.penalties;
  };
  
  const determineWinnerOriginal = (match: MatchData, kumiteScore: KumiteScore): string | null => {
    if (!match || match.type !== "kumite") return null;

    const athlete1 = kumiteScore.athlete1;
    const athlete2 = kumiteScore.athlete2;

    if (athlete1.hansoku > 0 || athlete1.shikkaku > 0)
      return match.athlete2;
    if (athlete2.hansoku > 0 || athlete2.shikkaku > 0)
      return match.athlete1;

    const athlete1Score = calculateKumitePointsOriginal("athlete1", kumiteScore);
    const athlete2Score = calculateKumitePointsOriginal("athlete2", kumiteScore);

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
  
  // Fixing type comparison error by checking match type as string
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
  
  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <header className="border-b border-slate-700/50 pb-4 mb-6 p-6">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          {scoreboardData.match.category} - {scoreboardData.match.type === "kata" ? "Kata" : "Kumite"}
        </h1>
      </header>

      <main className="flex-1 px-8">
        {/* Fix the type comparison by using string comparison */}
        {scoreboardData.match.type === "kata" ? (
          <KataScoreboard 
            scoreboardData={scoreboardData} 
            formatTime={formatTime} 
            calculateKataTotal={calculateKataTotal} 
            timeLeft={timeLeft} 
            id={id}
            kataScore={kataScore || scoreboardData.kataScore}
          />
        ) : (
          <div className="grid grid-cols-2 gap-8 h-full">
            {kumiteScore && (
              <>
                <div className="relative">
                  <div className={`rounded-2xl p-8 h-full flex flex-col items-center justify-center bg-gradient-to-br ${
                    senshu === "athlete1" ? 'from-blue-900/40 to-blue-800/40' : 'from-blue-900/20 to-blue-800/20'
                  } border-2 ${senshu === "athlete1" ? 'border-blue-500' : 'border-blue-500/20'}`}>
                    {(senshu === "athlete1" || (false && determineWinner() === scoreboardData.match.athlete1)) && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 animate-bounce">
                        <Crown className="h-8 w-8 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                      </div>
                    )}
                    
                    <div className="w-28 h-28 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 border-2 border-blue-400/30">
                      <User className="h-14 w-14 text-blue-400" />
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-4 text-blue-100">
                      {scoreboardData.match.athlete1}
                    </h2>

                    {senshu === "athlete1" && (
                      <div className="absolute top-4 left-4 flex items-center gap-2 bg-amber-500/20 px-3 py-1.5 rounded-full border border-amber-500/30">
                        <Star className="h-4 w-4 text-amber-400" />
                        <span className="text-sm font-semibold text-amber-300">Senshu</span>
                      </div>
                    )}
                    
                    {false && determineWinner() === scoreboardData.match.athlete1 && (
                      <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-bold mb-4">
                        Vencedor
                      </div>
                    )}

                    <div className="bg-blue-500/10 rounded-xl p-6 w-full border border-blue-500/20">
                      <div className="text-center mb-6">
                        <span className="text-6xl font-bold text-blue-400">
                          {calculateKumitePoints("athlete1")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className={`rounded-2xl p-8 h-full flex flex-col items-center justify-center bg-gradient-to-br ${
                    senshu === "athlete2" ? 'from-red-900/40 to-red-800/40' : 'from-red-900/20 to-red-800/20'
                  } border-2 ${senshu === "athlete2" ? 'border-red-500' : 'border-red-500/20'}`}>
                    {(senshu === "athlete2" || (false && determineWinner() === scoreboardData.match.athlete2)) && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 animate-bounce">
                        <Crown className="h-8 w-8 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                      </div>
                    )}
                    
                    <div className="w-28 h-28 bg-red-500/20 rounded-full flex items-center justify-center mb-4 border-2 border-red-400/30">
                      <User className="h-14 w-14 text-red-400" />
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-4 text-red-100">
                      {scoreboardData.match.athlete2}
                    </h2>

                    {senshu === "athlete2" && (
                      <div className="absolute top-4 right-4 flex items-center gap-2 bg-amber-500/20 px-3 py-1.5 rounded-full border border-amber-500/30">
                        <Star className="h-4 w-4 text-amber-400" />
                        <span className="text-sm font-semibold text-amber-300">Senshu</span>
                      </div>
                    )}
                    
                    {false && determineWinner() === scoreboardData.match.athlete2 && (
                      <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-bold mb-4">
                        Vencedor
                      </div>
                    )}

                    <div className="bg-red-500/10 rounded-xl p-6 w-full border border-red-500/20">
                      <div className="text-center mb-6">
                        <span className="text-6xl font-bold text-red-400">
                          {calculateKumitePoints("athlete2")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
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

const KumiteScoreboardOriginal = ({ 
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
              <div className={`rounded-2xl p-8 h-full flex flex-col items-center justify-center ${
                showCrownAthlete1 || (showWinnerBadge && winner === scoreboardData.match.athlete1) 
                ? 'bg-blue-500/10 border-2 border-blue-500/30' 
                : 'bg-blue-900/20 border border-blue-500/20'
              }`}>
                {(showCrownAthlete1 || (showWinnerBadge && winner === scoreboardData.match.athlete1)) && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <Crown className="h-16 w-16 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
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
              <div className={`rounded-2xl p-8 h-full flex flex-col items-center justify-center ${
                showCrownAthlete2 || (showWinnerBadge && winner === scoreboardData.match.athlete2) 
                ? 'bg-red-500/10 border-2 border-red-500/30' 
                : 'bg-red-900/20 border border-red-500/20'
              }`}>
                {(showCrownAthlete2 || (showWinnerBadge && winner === scoreboardData.match.athlete2)) && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <Crown className="h-16 w-16 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                  </div>
                )}
                
                <div className="w-32 h-32 bg-red-500/20 rounded-full flex items-center justify-center mb-4 border border-red-500/30">
                  <User className="h-16 w-16 text-red-400" />
                </div>
                
                <h2 className="text-3xl font-bold mb-6 text-red-100">{scoreboardData.match.athlete2}</h2>
                
                {showWinnerBadge && winner === scoreboardData.match.athlete2 && (
                  <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-bold mb-4">
                    Vencedor
                  </div>
                )}

                <div className="bg-red-500/10 rounded-xl p-6 w-full border border-red-500/20">
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
