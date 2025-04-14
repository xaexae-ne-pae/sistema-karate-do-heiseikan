
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Trophy, User, Crown, Clock } from "lucide-react";
import { MatchData, KataScore, KumiteScore, ScoreboardData } from "@/types";

const Scoreboard = () => {
  const { id } = useParams<{ id: string }>();
  const [scoreboardData, setScoreboardData] = useState<ScoreboardData | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(180);
  
  useEffect(() => {
    // Função para carregar dados do localStorage com tratamento de dados mais robusto
    const loadScoreboardData = () => {
      try {
        const data = localStorage.getItem("scoreboardData");
        if (data) {
          const parsedData = JSON.parse(data) as ScoreboardData;
          
          // Verificar se os dados são válidos antes de atualizar o estado
          if (parsedData && parsedData.match) {
            setScoreboardData(parsedData);
            
            // Atualiza o timer com os dados mais recentes
            if (parsedData.timeLeft !== undefined) {
              setTimeLeft(parsedData.timeLeft);
            }
          }
        }
      } catch (error) {
        console.error("Erro ao analisar dados do placar:", error);
      }
    };

    // Carrega os dados iniciais
    loadScoreboardData();

    // Adiciona listener para atualizações em tempo real
    const handleUpdate = () => {
      loadScoreboardData();
    };

    window.addEventListener("scoreboardUpdate", handleUpdate);
    
    // Configura listener para mensagens de storage para sincronização entre janelas
    const handleStorageUpdate = (event: StorageEvent) => {
      if (event.key === "scoreboardData") {
        loadScoreboardData();
      }
    };
    
    window.addEventListener("storage", handleStorageUpdate);

    // Verifica constantemente por atualizações (mais responsivo)
    const checkInterval = setInterval(() => {
      loadScoreboardData();
    }, 200); // Verifica com mais frequência para ser mais responsivo

    // Define o título da janela para facilitar a identificação
    document.title = "Placar - Karate Tournament";

    // Cleanup
    return () => {
      window.removeEventListener("scoreboardUpdate", handleUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
      clearInterval(checkInterval);
    };
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
  
  if (!scoreboardData) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        <p className="text-xl">Carregando dados do placar...</p>
      </div>
    );
  }
  
  // Renderiza o placar de Kata
  if (scoreboardData.match.type === "kata") {
    return <KataScoreboard scoreboardData={scoreboardData} formatTime={formatTime} calculateKataTotal={calculateKataTotal} timeLeft={timeLeft} id={id} />;
  }
  
  // Renderiza o placar de Kumite
  return <KumiteScoreboard 
    scoreboardData={scoreboardData} 
    formatTime={formatTime} 
    calculateKumitePoints={calculateKumitePoints}
    determineWinner={determineWinner}
    timeLeft={timeLeft}
    id={id}
  />;
};

// Componente separado para o Placar de Kata
const KataScoreboard = ({ 
  scoreboardData, 
  formatTime, 
  calculateKataTotal, 
  timeLeft,
  id 
}: { 
  scoreboardData: ScoreboardData, 
  formatTime: (seconds: number) => string,
  calculateKataTotal: (kataScore: KataScore) => number,
  timeLeft: number,
  id: string | undefined
}) => (
  <div className="flex flex-col h-screen bg-black text-white p-4">
    <header className="border-b border-white/20 pb-4 mb-6">
      <h1 className="text-4xl font-bold text-center">
        {scoreboardData.match.category} - Kata
      </h1>
    </header>
    
    <div className="flex flex-col items-center justify-center flex-grow">
      <div className="text-center mb-8">
        <div className="w-32 h-32 bg-primary/30 rounded-full mx-auto flex items-center justify-center mb-4">
          <User className="h-16 w-16 text-primary" />
        </div>
        <h2 className="text-5xl font-bold mb-2">{scoreboardData.match.athlete1}</h2>
      </div>
      
      {scoreboardData.kataScore && (
        <div className="bg-white/10 rounded-xl p-8 w-full max-w-2xl">
          <div className="grid grid-cols-3 gap-8 mb-8">
            {[
              { label: "Jurado 1", score: scoreboardData.kataScore.judge1 },
              { label: "Jurado 2", score: scoreboardData.kataScore.judge2 },
              { label: "Jurado 3", score: scoreboardData.kataScore.judge3 },
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
                {calculateKataTotal(scoreboardData.kataScore).toFixed(1)}
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

// Componente separado para o Placar de Kumite
const KumiteScoreboard = ({ 
  scoreboardData, 
  formatTime, 
  calculateKumitePoints, 
  determineWinner,
  timeLeft,
  id
}: { 
  scoreboardData: ScoreboardData, 
  formatTime: (seconds: number) => string,
  calculateKumitePoints: (athlete: "athlete1" | "athlete2", kumiteScore: KumiteScore) => number,
  determineWinner: (match: MatchData, kumiteScore: KumiteScore) => string | null,
  timeLeft: number,
  id: string | undefined
}) => (
  <div className="flex flex-col h-screen bg-black text-white p-4">
    <header className="border-b border-white/20 pb-4 mb-6">
      <h1 className="text-4xl font-bold text-center">
        {scoreboardData.match.category} - Kumite
      </h1>
    </header>
    
    <div className="flex-grow grid grid-cols-2 gap-8">
      {scoreboardData.kumiteScore && scoreboardData.match.athlete2 && (
        <>
          <div className="flex flex-col">
            <div className={`text-center mb-8 p-6 rounded-xl ${determineWinner(scoreboardData.match, scoreboardData.kumiteScore) === scoreboardData.match.athlete1 ? "bg-green-900/40" : ""}`}>
              <div className="w-28 h-28 bg-primary/30 rounded-full mx-auto flex items-center justify-center mb-4">
                <User className="h-14 w-14 text-primary" />
              </div>
              <h2 className="text-4xl font-bold mb-2">{scoreboardData.match.athlete1}</h2>
              {determineWinner(scoreboardData.match, scoreboardData.kumiteScore) === scoreboardData.match.athlete1 && (
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
                    {calculateKumitePoints("athlete1", scoreboardData.kumiteScore)}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 w-full mt-4">
                <div className="text-center">
                  <p className="text-lg mb-1">Yuko</p>
                  <div className="bg-white/10 rounded-lg py-2">
                    <p className="text-3xl font-bold">{scoreboardData.kumiteScore.athlete1.yuko}</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-lg mb-1">Waza-ari</p>
                  <div className="bg-white/10 rounded-lg py-2">
                    <p className="text-3xl font-bold">{scoreboardData.kumiteScore.athlete1.wazari}</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-lg mb-1">Ippon</p>
                  <div className="bg-white/10 rounded-lg py-2">
                    <p className="text-3xl font-bold">{scoreboardData.kumiteScore.athlete1.ippon}</p>
                  </div>
                </div>
              </div>
              
              {(scoreboardData.kumiteScore.athlete1.hansoku > 0 || scoreboardData.kumiteScore.athlete1.shikkaku > 0) && (
                <div className="mt-4 bg-red-900/40 w-full text-center rounded-lg p-2">
                  <p className="text-xl font-bold text-red-400">
                    {scoreboardData.kumiteScore.athlete1.hansoku > 0 ? "HANSOKU" : "SHIKKAKU"}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className={`text-center mb-8 p-6 rounded-xl ${determineWinner(scoreboardData.match, scoreboardData.kumiteScore) === scoreboardData.match.athlete2 ? "bg-green-900/40" : ""}`}>
              <div className="w-28 h-28 bg-primary/30 rounded-full mx-auto flex items-center justify-center mb-4">
                <User className="h-14 w-14 text-primary" />
              </div>
              <h2 className="text-4xl font-bold mb-2">{scoreboardData.match.athlete2}</h2>
              {determineWinner(scoreboardData.match, scoreboardData.kumiteScore) === scoreboardData.match.athlete2 && (
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
                    {calculateKumitePoints("athlete2", scoreboardData.kumiteScore)}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 w-full mt-4">
                <div className="text-center">
                  <p className="text-lg mb-1">Yuko</p>
                  <div className="bg-white/10 rounded-lg py-2">
                    <p className="text-3xl font-bold">{scoreboardData.kumiteScore.athlete2.yuko}</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-lg mb-1">Waza-ari</p>
                  <div className="bg-white/10 rounded-lg py-2">
                    <p className="text-3xl font-bold">{scoreboardData.kumiteScore.athlete2.wazari}</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-lg mb-1">Ippon</p>
                  <div className="bg-white/10 rounded-lg py-2">
                    <p className="text-3xl font-bold">{scoreboardData.kumiteScore.athlete2.ippon}</p>
                  </div>
                </div>
              </div>
              
              {(scoreboardData.kumiteScore.athlete2.hansoku > 0 || scoreboardData.kumiteScore.athlete2.shikkaku > 0) && (
                <div className="mt-4 bg-red-900/40 w-full text-center rounded-lg p-2">
                  <p className="text-xl font-bold text-red-400">
                    {scoreboardData.kumiteScore.athlete2.hansoku > 0 ? "HANSOKU" : "SHIKKAKU"}
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

export default Scoreboard;
