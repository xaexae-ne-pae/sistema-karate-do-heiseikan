import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Timer, Trophy, AlertTriangle, Flag, Minus, Clock, Award, Zap } from "lucide-react";

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
  const [penalties, setPenalties] = useState({
    athlete1: { jogai: 0, chukoku: 0, keikoku: 0 },
    athlete2: { jogai: 0, chukoku: 0, keikoku: 0 }
  });
  const [matchStarted, setMatchStarted] = useState(false);
  const [matchPaused, setMatchPaused] = useState(false);
  const [showPenalty, setShowPenalty] = useState<{visible: boolean, athlete: string, type: string} | null>(null);
  
  const startSoundRef = useRef<HTMLAudioElement | null>(null);
  const countdownSoundRef = useRef<HTMLAudioElement | null>(null);
  const penaltySoundRef = useRef<HTMLAudioElement | null>(null);
  const pointSoundRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    console.log("ScoringFullscreen mounted. ID:", id, "Type:", matchType);
    
    startSoundRef.current = new Audio("/sounds/match-start.mp3");
    countdownSoundRef.current = new Audio("/sounds/countdown.mp3");
    penaltySoundRef.current = new Audio("/sounds/penalty.mp3");
    pointSoundRef.current = new Audio("/sounds/point.mp3");
    
    return () => {
      startSoundRef.current = null;
      countdownSoundRef.current = null;
      penaltySoundRef.current = null;
      pointSoundRef.current = null;
    };
  }, [id, matchType]);
  
  useEffect(() => {
    if (matchStarted && !matchPaused) {
      startSoundRef.current?.play();
    }
  }, [matchStarted, matchPaused]);
  
  useEffect(() => {
    if (matchStarted && !matchPaused && time <= 10 && time > 0) {
      countdownSoundRef.current?.play();
    }
  }, [time, matchStarted, matchPaused]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };
  
  useEffect(() => {
    const fetchMatch = () => {
      console.log("Fetching match data for ID:", id, "Type:", matchType);
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
  
  const prevPenaltiesRef = useRef(penalties);
  
  useEffect(() => {
    const prevPenalties = prevPenaltiesRef.current;
    
    for (const type of ['jogai', 'chukoku', 'keikoku'] as const) {
      if (penalties.athlete1[type] > prevPenalties.athlete1[type]) {
        setShowPenalty({
          visible: true,
          athlete: match?.athlete1.name || 'Atleta AKA',
          type: getPenaltyName(type)
        });
        penaltySoundRef.current?.play();
        
        setTimeout(() => {
          setShowPenalty(null);
        }, 3000);
        break;
      }
    }
    
    for (const type of ['jogai', 'chukoku', 'keikoku'] as const) {
      if (penalties.athlete2[type] > prevPenalties.athlete2[type]) {
        setShowPenalty({
          visible: true,
          athlete: match?.athlete2.name || 'Atleta AO',
          type: getPenaltyName(type)
        });
        penaltySoundRef.current?.play();
        
        setTimeout(() => {
          setShowPenalty(null);
        }, 3000);
        break;
      }
    }
    
    prevPenaltiesRef.current = penalties;
  }, [penalties, match]);
  
  const prevScoresRef = useRef(scores);
  
  useEffect(() => {
    const prevScores = prevScoresRef.current;
    
    if (scores.athlete1.total > prevScores.athlete1.total || 
        scores.athlete2.total > prevScores.athlete2.total) {
      pointSoundRef.current?.play();
    }
    
    prevScoresRef.current = scores;
  }, [scores]);
  
  const getPenaltyName = (penaltyType: string): string => {
    switch (penaltyType) {
      case 'jogai': return 'Jogai (Saída da Área)';
      case 'chukoku': return 'Chukoku (Advertência)';
      case 'keikoku': return 'Keikoku (Penalidade)';
      default: return 'Penalidade';
    }
  };
  
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      console.log("Received message in fullscreen:", data);
      
      if (data.type === 'UPDATE_SCORES') {
        console.log("Updating scores:", data.scores);
        setScores(data.scores);
      } else if (data.type === 'UPDATE_TIME') {
        console.log("Updating time:", data.time, "Started:", data.matchStarted, "Paused:", data.matchPaused);
        setTime(data.time);
        setMatchStarted(data.matchStarted);
        setMatchPaused(data.matchPaused);
      } else if (data.type === 'UPDATE_PENALTIES') {
        console.log("Updating penalties:", data.penalties);
        setPenalties(data.penalties);
      } else if (data.type === 'REQUEST_STATE') {
        console.log("Main window requested state");
      }
    };

    window.addEventListener('message', handleMessage);
    
    if (window.opener) {
      console.log("Requesting state from opener");
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
  
  const totalPoints1 = scores.athlete1.total || 0;
  const totalPoints2 = scores.athlete2.total || 0;
  
  const winner = totalPoints1 > totalPoints2 ? 'athlete1' : totalPoints1 < totalPoints2 ? 'athlete2' : null;
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-black overflow-hidden text-white flex flex-col">
      <header className="bg-gradient-to-r from-primary/90 to-primary/60 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Trophy className="h-6 w-6" />
          <h1 className="text-2xl font-bold">{match.category}</h1>
        </div>
        
        <div className={`flex items-center justify-center gap-2 px-5 py-2 rounded-lg font-mono text-2xl
          ${time <= 10 ? "bg-red-500/40 text-red-300" : "bg-black/40 border border-white/10"}
          ${!matchStarted || matchPaused ? "animate-pulse" : ""}
          shadow-lg
        `}>
          <Clock className={`h-5 w-5 ${time <= 10 ? "text-red-300" : "text-white"}`} />
          <span>{formatTime(time)}</span>
        </div>
      </header>
      
      <main className="flex-1 flex items-stretch p-4 gap-4">
        <div className={`flex-1 p-5 rounded-xl border flex flex-col transition-all duration-300
          ${winner === 'athlete1' 
            ? 'bg-gradient-to-b from-red-950/70 to-red-900/30 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
            : 'bg-gradient-to-b from-red-950/50 to-red-900/20 border-white/10'}
          w-full
        `}>
          <div className="bg-gradient-to-r from-red-800/40 to-red-800/20 py-4 px-6 rounded-lg mb-6 border border-red-700/30 shadow-md">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">{match.athlete1.name}</h2>
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">AKA</span>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <Award className="h-5 w-5 text-red-400" /> Pontos
            </h3>
            <div className="grid grid-cols-3 gap-4 mt-2">
              <ScoreBlock label="YUKO" points="1" value={scores.athlete1.yuko} color="red" />
              <ScoreBlock label="WAZARI" points="2" value={scores.athlete1.wazari} color="red" />
              <ScoreBlock label="IPPON" points="4" value={scores.athlete1.ippon} color="red" />
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" /> Penalidades
            </h3>
            <div className="grid grid-cols-3 gap-4 mt-2">
              <PenaltyIndicator type="Jogai" count={penalties.athlete1.jogai} />
              <PenaltyIndicator type="Chukoku" count={penalties.athlete1.chukoku} />
              <PenaltyIndicator type="Keikoku" count={penalties.athlete1.keikoku} />
            </div>
          </div>
          
          <div className="mt-auto">
            <div className="flex justify-between items-center bg-gradient-to-r from-black/60 to-red-950/40 rounded-lg p-4 border border-red-900/30 shadow-md">
              <span className="text-xl">Total de Pontos</span>
              <span className={`text-5xl font-bold ${totalPoints1 > 0 ? 'text-red-300' : 'text-white'}`}>
                {totalPoints1}
              </span>
            </div>
          </div>
        </div>
        
        <div className={`flex-1 p-5 rounded-xl border flex flex-col transition-all duration-300
          ${winner === 'athlete2' 
            ? 'bg-gradient-to-b from-blue-950/70 to-blue-900/30 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
            : 'bg-gradient-to-b from-blue-950/50 to-blue-900/20 border-white/10'}
          w-full
        `}>
          <div className="bg-gradient-to-r from-blue-800/40 to-blue-800/20 py-4 px-6 rounded-lg mb-6 border border-blue-700/30 shadow-md">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">{match.athlete2.name}</h2>
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">AO</span>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-400" /> Pontos
            </h3>
            <div className="grid grid-cols-3 gap-4 mt-2">
              <ScoreBlock label="YUKO" points="1" value={scores.athlete2.yuko} color="blue" />
              <ScoreBlock label="WAZARI" points="2" value={scores.athlete2.wazari} color="blue" />
              <ScoreBlock label="IPPON" points="4" value={scores.athlete2.ippon} color="blue" />
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" /> Penalidades
            </h3>
            <div className="grid grid-cols-3 gap-4 mt-2">
              <PenaltyIndicator type="Jogai" count={penalties.athlete2.jogai} />
              <PenaltyIndicator type="Chukoku" count={penalties.athlete2.chukoku} />
              <PenaltyIndicator type="Keikoku" count={penalties.athlete2.keikoku} />
            </div>
          </div>
          
          <div className="mt-auto">
            <div className="flex justify-between items-center bg-gradient-to-r from-black/60 to-blue-950/40 rounded-lg p-4 border border-blue-900/30 shadow-md">
              <span className="text-xl">Total de Pontos</span>
              <span className={`text-5xl font-bold ${totalPoints2 > 0 ? 'text-blue-300' : 'text-white'}`}>
                {totalPoints2}
              </span>
            </div>
          </div>
        </div>
      </main>
      
      <div className="py-3 px-6 bg-gradient-to-r from-black/80 to-black/60 text-center border-t border-b border-white/10">
        {!matchStarted ? (
          <div className="flex items-center justify-center gap-2 text-yellow-400 font-medium">
            <Timer className="h-5 w-5 animate-pulse" />
            <span>Aguardando início da luta</span>
          </div>
        ) : matchPaused ? (
          <div className="flex items-center justify-center gap-2 text-yellow-400 font-medium">
            <Timer className="h-5 w-5 animate-pulse" />
            <span>Luta pausada</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-green-400 font-medium">
            <Zap className="h-5 w-5" />
            <span>Luta em andamento</span>
          </div>
        )}
      </div>
      
      <footer className="py-4 px-6 bg-gradient-to-r from-black to-black/80 flex justify-between items-center border-t border-white/5">
        <div className="text-lg text-white/70">
          Dojo Heiseikan - Campeonato de Karatê 2025
        </div>
        <div className="text-lg">
          {matchType === "kumite" ? "Combate" : "Kata"} - {match.category}
        </div>
      </footer>
      
      {showPenalty && showPenalty.visible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-red-600/90 text-white px-8 py-6 rounded-lg shadow-lg animate-pulse backdrop-blur-sm border border-red-500/50">
            <div className="flex items-center gap-3 text-2xl font-bold mb-2">
              <AlertTriangle className="h-8 w-8" />
              <h3>Penalidade</h3>
            </div>
            <p className="text-xl">{showPenalty.athlete}</p>
            <p className="text-lg opacity-90">{showPenalty.type}</p>
          </div>
        </div>
      )}
      
      <audio src="/sounds/match-start.mp3" preload="auto" />
      <audio src="/sounds/countdown.mp3" preload="auto" />
      <audio src="/sounds/penalty.mp3" preload="auto" />
      <audio src="/sounds/point.mp3" preload="auto" />
    </div>
  );
};

const ScoreBlock = ({ label, points, value, color }: { label: string, points: string, value: number, color: "red" | "blue" }) => {
  const bgGradient = color === "red" 
    ? "bg-gradient-to-br from-red-900/50 to-red-800/30" 
    : "bg-gradient-to-br from-blue-900/50 to-blue-800/30";
    
  const borderColor = color === "red" 
    ? "border-red-700/40" 
    : "border-blue-700/40";
    
  const valueColor = color === "red" 
    ? "text-red-300" 
    : "text-blue-300";
    
  const valueSize = value > 9 ? "text-4xl" : "text-5xl";
  
  return (
    <div 
      className={`
        rounded-lg ${bgGradient} border ${borderColor} 
        p-4 text-center shadow-md transition-all duration-200 
        hover:scale-105 w-full min-w-[120px]
      `}
    >
      <div className="text-xl font-medium mb-1">{label}</div>
      <div className="text-sm mb-3 opacity-70">{points} ponto{Number(points) > 1 ? "s" : ""}</div>
      <div className={`${valueSize} font-bold ${value > 0 ? valueColor : "text-white/80"}`}>
        {value}
      </div>
    </div>
  );
};

const PenaltyIndicator = ({ type, count }: { type: string, count: number }) => {
  const getIcon = () => {
    switch (type.toLowerCase()) {
      case 'jogai': return <Flag className="h-4 w-4" />;
      case 'chukoku': return <AlertTriangle className="h-4 w-4" />;
      case 'keikoku': return <Minus className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };
  
  const isActive = count > 0;
  
  return (
    <div className={`border rounded px-3 py-2 text-center shadow-md transition-all duration-200 ${
      isActive 
        ? "bg-gradient-to-br from-yellow-800/50 to-yellow-900/30 border-yellow-600/50" 
        : "bg-black/30 border-gray-700/30 opacity-70"
    }`}>
      <div className="flex items-center justify-center gap-1 mb-1">
        {getIcon()}
        <span className="font-medium">{type}</span>
      </div>
      <div className={`text-xl font-bold mt-1 ${isActive ? "text-yellow-400" : "text-white/60"}`}>{count}</div>
    </div>
  );
};

export default ScoringFullscreen;
