
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Timer, Trophy } from "lucide-react";

const ScoringFullscreen = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const matchType = searchParams.get("type") || "kumite";
  const [match, setMatch] = useState<any>(null);
  const [time, setTime] = useState(120); // 2 minutes in seconds
  const [scores, setScores] = useState({
    athlete1: { yuko: 0, wazari: 0, ippon: 0, total: 0 },
    athlete2: { yuko: 0, wazari: 0, ippon: 0, total: 0 }
  });
  const [matchStarted, setMatchStarted] = useState(false);
  const [matchPaused, setMatchPaused] = useState(false);
  
  // Formatar o tempo em MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };
  
  // Simular carregamento de dados do combate
  useEffect(() => {
    // Em uma aplicação real, buscaria os dados da API
    const fetchMatch = () => {
      // Simulando dados
      if (matchType === "kumite") {
        const kumiteMatches = [
          {
            id: 1,
            category: "Kumite Masculino -75kg",
            athlete1: { name: "João Silva", color: "red" },
            athlete2: { name: "Carlos Eduardo", color: "blue" },
          },
          {
            id: 2,
            category: "Kumite Feminino -61kg",
            athlete1: { name: "Ana Pereira", color: "red" },
            athlete2: { name: "Lúcia Fernandes", color: "blue" },
          },
          {
            id: 3,
            category: "Kumite Masculino -67kg",
            athlete1: { name: "Pedro Santos", color: "red" },
            athlete2: { name: "Fernando Costa", color: "blue" },
          },
        ];
        setMatch(kumiteMatches.find(m => m.id === Number(id)) || kumiteMatches[0]);
      } else {
        const kataMatches = [
          {
            id: 4,
            category: "Kata Individual Masculino",
            athlete1: { name: "Ricardo Gomes", color: "red" },
            athlete2: { name: "Henrique Lima", color: "blue" },
          },
          {
            id: 5,
            category: "Kata Individual Feminino",
            athlete1: { name: "Maria Oliveira", color: "red" },
            athlete2: { name: "Juliana Costa", color: "blue" },
          },
          {
            id: 6,
            category: "Kata por Equipes",
            athlete1: { name: "Equipe Shotokan", color: "red" },
            athlete2: { name: "Equipe Wado-Ryu", color: "blue" },
          },
        ];
        setMatch(kataMatches.find(m => m.id === Number(id)) || kataMatches[0]);
      }
    };
    
    fetchMatch();
  }, [id, matchType]);

  // Atualização dos pontos e tempo via mensagens
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      
      if (data.type === 'UPDATE_SCORES') {
        setScores(data.scores);
      } else if (data.type === 'UPDATE_TIME') {
        setTime(data.time);
        setMatchStarted(data.matchStarted);
        setMatchPaused(data.matchPaused);
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Solicitar estado atual
    if (window.opener) {
      window.opener.postMessage({ type: 'REQUEST_STATE', matchId: id }, '*');
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [id]);
  
  if (!match) {
    return (
      <div className="min-h-screen w-full bg-black flex items-center justify-center">
        <p className="text-2xl text-white">Carregando...</p>
      </div>
    );
  }
  
  // Cálculo de pontuação total
  const totalPoints1 = scores.athlete1.yuko + (scores.athlete1.wazari * 2) + (scores.athlete1.ippon * 4);
  const totalPoints2 = scores.athlete2.yuko + (scores.athlete2.wazari * 2) + (scores.athlete2.ippon * 4);
  
  // Determinar o vencedor atual
  const winner = totalPoints1 > totalPoints2 ? 'athlete1' : totalPoints1 < totalPoints2 ? 'athlete2' : null;
  
  return (
    <div className="min-h-screen w-full bg-black overflow-hidden text-white flex flex-col">
      {/* Cabeçalho com informações do combate */}
      <header className="bg-gradient-to-r from-primary/80 to-primary/50 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Trophy className="h-6 w-6" />
          <h1 className="text-2xl font-bold">{match.category}</h1>
        </div>
        
        <div className={`flex items-center justify-center gap-2 px-5 py-2 rounded-lg font-mono text-2xl
          ${time <= 10 ? "bg-red-500/30 text-red-500" : "bg-black/30"}
        `}>
          <Timer className={`h-5 w-5 ${time <= 10 ? "text-red-500" : "text-white"}`} />
          <span>{formatTime(time)}</span>
        </div>
      </header>
      
      {/* Área principal com a pontuação */}
      <main className="flex-1 flex items-stretch p-6">
        <div className={`flex-1 p-6 bg-gradient-to-b from-red-900/20 to-red-900/5 rounded-l-xl border-r border-white/10 flex flex-col ${winner === 'athlete1' ? 'ring-2 ring-red-500/50' : ''}`}>
          <div className="bg-gradient-to-r from-red-700/30 to-red-700/10 py-6 px-8 rounded-lg mb-8">
            <h2 className="text-4xl font-bold mb-2">{match.athlete1.name}</h2>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-xl text-red-200">Atleta AKA</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-8 mt-4">
            <ScoreBlock label="YUKO" points="1" value={scores.athlete1.yuko} color="red" />
            <ScoreBlock label="WAZARI" points="2" value={scores.athlete1.wazari} color="red" />
            <ScoreBlock label="IPPON" points="4" value={scores.athlete1.ippon} color="red" />
          </div>
          
          <div className="mt-auto">
            <div className="flex justify-between items-center bg-black/40 rounded-lg p-4">
              <span className="text-xl">Total de Pontos</span>
              <span className="text-5xl font-bold">{totalPoints1}</span>
            </div>
          </div>
        </div>
        
        <div className={`flex-1 p-6 bg-gradient-to-b from-blue-900/20 to-blue-900/5 rounded-r-xl border-l border-white/10 flex flex-col ${winner === 'athlete2' ? 'ring-2 ring-blue-500/50' : ''}`}>
          <div className="bg-gradient-to-r from-blue-700/30 to-blue-700/10 py-6 px-8 rounded-lg mb-8">
            <h2 className="text-4xl font-bold mb-2">{match.athlete2.name}</h2>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span className="text-xl text-blue-200">Atleta AO</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-8 mt-4">
            <ScoreBlock label="YUKO" points="1" value={scores.athlete2.yuko} color="blue" />
            <ScoreBlock label="WAZARI" points="2" value={scores.athlete2.wazari} color="blue" />
            <ScoreBlock label="IPPON" points="4" value={scores.athlete2.ippon} color="blue" />
          </div>
          
          <div className="mt-auto">
            <div className="flex justify-between items-center bg-black/40 rounded-lg p-4">
              <span className="text-xl">Total de Pontos</span>
              <span className="text-5xl font-bold">{totalPoints2}</span>
            </div>
          </div>
        </div>
      </main>
      
      {/* Informações de rodapé */}
      <footer className="py-4 px-6 bg-black/50 flex justify-between items-center">
        <div className="text-lg text-white/70">
          Dojo Heiseikan - Campeonato de Karatê 2025
        </div>
        <div className="text-lg">
          {matchType === "kumite" ? "Combate" : "Kata"} - {match.category}
        </div>
      </footer>
    </div>
  );
};

// Componente para exibir os blocos de pontuação
const ScoreBlock = ({ label, points, value, color }: { label: string, points: string, value: number, color: "red" | "blue" }) => {
  const bgColor = color === "red" 
    ? "bg-red-900/30 border-red-700/50" 
    : "bg-blue-900/30 border-blue-700/50";
  
  return (
    <div className={`rounded-lg ${bgColor} border p-4 text-center`}>
      <div className="text-xl mb-1">{label}</div>
      <div className="text-sm mb-4 opacity-70">{points} ponto{Number(points) > 1 ? "s" : ""}</div>
      <div className={`text-5xl font-bold ${color === "red" ? "text-red-300" : "text-blue-300"}`}>
        {value}
      </div>
    </div>
  );
};

export default ScoringFullscreen;
