
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Trophy, User, Crown, Clock } from "lucide-react";

interface MatchData {
  id: number;
  type: "kata" | "kumite";
  athlete1: string;
  athlete2: string | null;
  category: string;
  time: string;
}

interface KataScore {
  judge1: number;
  judge2: number;
  judge3: number;
}

interface KumiteScore {
  athlete1: {
    yuko: number;
    wazari: number;
    ippon: number;
    penalties: number;
    jogai: number;
    mubobi: number;
    chukoku: number;
    keikoku: number;
    hansokuChui: number;
    hansoku: number;
    shikkaku: number;
  };
  athlete2: {
    yuko: number;
    wazari: number;
    ippon: number;
    penalties: number;
    jogai: number;
    mubobi: number;
    chukoku: number;
    keikoku: number;
    hansokuChui: number;
    hansoku: number;
    shikkaku: number;
  };
}

interface ScoreboardData {
  match: MatchData;
  timeLeft: number;
  kataScore: KataScore | null;
  kumiteScore: KumiteScore | null;
}

const Scoreboard = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ScoreboardData | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(180);
  
  useEffect(() => {
    // Get data from sessionStorage
    const storedData = sessionStorage.getItem("scoreboardData");
    if (storedData) {
      const parsedData = JSON.parse(storedData) as ScoreboardData;
      setData(parsedData);
      setTimeLeft(parsedData.timeLeft);
      
      // Auto refresh data every 2 seconds
      const intervalId = setInterval(() => {
        const refreshedData = sessionStorage.getItem("scoreboardData");
        if (refreshedData) {
          const newData = JSON.parse(refreshedData) as ScoreboardData;
          setData(newData);
          setTimeLeft(newData.timeLeft);
        }
      }, 2000);
      
      return () => clearInterval(intervalId);
    }
  }, []);
  
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
  
  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        <p className="text-xl">Carregando dados do placar...</p>
      </div>
    );
  }
  
  if (data.match.type === "kata") {
    return (
      <div className="flex flex-col h-screen bg-black text-white p-4">
        <header className="border-b border-white/20 pb-4 mb-6">
          <h1 className="text-4xl font-bold text-center">
            {data.match.category} - Kata
          </h1>
        </header>
        
        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="text-center mb-8">
            <div className="w-32 h-32 bg-primary/30 rounded-full mx-auto flex items-center justify-center mb-4">
              <User className="h-16 w-16 text-primary" />
            </div>
            <h2 className="text-5xl font-bold mb-2">{data.match.athlete1}</h2>
          </div>
          
          {data.kataScore && (
            <div className="bg-white/10 rounded-xl p-8 w-full max-w-2xl">
              <div className="grid grid-cols-3 gap-8 mb-8">
                {[
                  { label: "Jurado 1", score: data.kataScore.judge1 },
                  { label: "Jurado 2", score: data.kataScore.judge2 },
                  { label: "Jurado 3", score: data.kataScore.judge3 },
                ].map((judge, index) => (
                  <div key={index} className="text-center">
                    <p className="text-xl mb-2">{judge.label}</p>
                    <div className="bg-white/10 rounded-lg py-3">
                      <p className="text-4xl font-bold">{judge.score.toFixed(1)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <p className="text-2xl mb-2">Pontuação Total</p>
                <div className="bg-primary/20 rounded-lg py-4">
                  <p className="text-6xl font-bold text-primary">
                    {calculateKataTotal(data.kataScore).toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <footer className="border-t border-white/20 pt-4 mt-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Trophy className="h-6 w-6 text-primary mr-2" />
              <span className="text-2xl">Torneio #{id}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-6 w-6 text-red-500 mr-2" />
              <span className={`text-3xl font-mono ${timeLeft <= 10 ? "text-red-500 animate-pulse" : ""}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </footer>
      </div>
    );
  }
  
  // Kumite scoreboard
  return (
    <div className="flex flex-col h-screen bg-black text-white p-4">
      <header className="border-b border-white/20 pb-4 mb-6">
        <h1 className="text-4xl font-bold text-center">
          {data.match.category} - Kumite
        </h1>
      </header>
      
      <div className="flex-grow grid grid-cols-2 gap-8">
        {data.kumiteScore && data.match.athlete2 && (
          <>
            <div className="flex flex-col">
              <div className={`text-center mb-8 p-6 rounded-xl ${determineWinner(data.match, data.kumiteScore) === data.match.athlete1 ? "bg-green-900/40" : ""}`}>
                <div className="w-28 h-28 bg-primary/30 rounded-full mx-auto flex items-center justify-center mb-4">
                  <User className="h-14 w-14 text-primary" />
                </div>
                <h2 className="text-4xl font-bold mb-2">{data.match.athlete1}</h2>
                {determineWinner(data.match, data.kumiteScore) === data.match.athlete1 && (
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Crown className="h-6 w-6 text-yellow-500" />
                    <span className="text-xl font-bold text-yellow-500">Vencedor</span>
                  </div>
                )}
              </div>
              
              <div className="bg-white/10 rounded-xl p-6 flex flex-col items-center">
                <div className="text-center mb-4">
                  <p className="text-xl mb-2">Pontuação</p>
                  <div className="bg-primary/20 rounded-lg py-3 px-10">
                    <p className="text-6xl font-bold text-primary">
                      {calculateKumitePoints("athlete1", data.kumiteScore)}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 w-full mt-4">
                  <div className="text-center">
                    <p className="text-lg mb-1">Yuko</p>
                    <div className="bg-white/10 rounded-lg py-2">
                      <p className="text-3xl font-bold">{data.kumiteScore.athlete1.yuko}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-lg mb-1">Waza-ari</p>
                    <div className="bg-white/10 rounded-lg py-2">
                      <p className="text-3xl font-bold">{data.kumiteScore.athlete1.wazari}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-lg mb-1">Ippon</p>
                    <div className="bg-white/10 rounded-lg py-2">
                      <p className="text-3xl font-bold">{data.kumiteScore.athlete1.ippon}</p>
                    </div>
                  </div>
                </div>
                
                {(data.kumiteScore.athlete1.hansoku > 0 || data.kumiteScore.athlete1.shikkaku > 0) && (
                  <div className="mt-4 bg-red-900/40 w-full text-center rounded-lg p-2">
                    <p className="text-xl font-bold text-red-400">
                      {data.kumiteScore.athlete1.hansoku > 0 ? "HANSOKU" : "SHIKKAKU"}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className={`text-center mb-8 p-6 rounded-xl ${determineWinner(data.match, data.kumiteScore) === data.match.athlete2 ? "bg-green-900/40" : ""}`}>
                <div className="w-28 h-28 bg-primary/30 rounded-full mx-auto flex items-center justify-center mb-4">
                  <User className="h-14 w-14 text-primary" />
                </div>
                <h2 className="text-4xl font-bold mb-2">{data.match.athlete2}</h2>
                {determineWinner(data.match, data.kumiteScore) === data.match.athlete2 && (
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Crown className="h-6 w-6 text-yellow-500" />
                    <span className="text-xl font-bold text-yellow-500">Vencedor</span>
                  </div>
                )}
              </div>
              
              <div className="bg-white/10 rounded-xl p-6 flex flex-col items-center">
                <div className="text-center mb-4">
                  <p className="text-xl mb-2">Pontuação</p>
                  <div className="bg-primary/20 rounded-lg py-3 px-10">
                    <p className="text-6xl font-bold text-primary">
                      {calculateKumitePoints("athlete2", data.kumiteScore)}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 w-full mt-4">
                  <div className="text-center">
                    <p className="text-lg mb-1">Yuko</p>
                    <div className="bg-white/10 rounded-lg py-2">
                      <p className="text-3xl font-bold">{data.kumiteScore.athlete2.yuko}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-lg mb-1">Waza-ari</p>
                    <div className="bg-white/10 rounded-lg py-2">
                      <p className="text-3xl font-bold">{data.kumiteScore.athlete2.wazari}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-lg mb-1">Ippon</p>
                    <div className="bg-white/10 rounded-lg py-2">
                      <p className="text-3xl font-bold">{data.kumiteScore.athlete2.ippon}</p>
                    </div>
                  </div>
                </div>
                
                {(data.kumiteScore.athlete2.hansoku > 0 || data.kumiteScore.athlete2.shikkaku > 0) && (
                  <div className="mt-4 bg-red-900/40 w-full text-center rounded-lg p-2">
                    <p className="text-xl font-bold text-red-400">
                      {data.kumiteScore.athlete2.hansoku > 0 ? "HANSOKU" : "SHIKKAKU"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      
      <footer className="border-t border-white/20 pt-4 mt-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Trophy className="h-6 w-6 text-primary mr-2" />
            <span className="text-2xl">Torneio #{id}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-6 w-6 text-red-500 mr-2" />
            <span className={`text-3xl font-mono ${timeLeft <= 10 ? "text-red-500 animate-pulse" : ""}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Scoreboard;
