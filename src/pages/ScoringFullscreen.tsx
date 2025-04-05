
import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Timer, Trophy, AlertTriangle, Flag, Minus } from "lucide-react";

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
  
  // Audio refs for sound effects
  const startSoundRef = useRef<HTMLAudioElement | null>(null);
  const countdownSoundRef = useRef<HTMLAudioElement | null>(null);
  const penaltySoundRef = useRef<HTMLAudioElement | null>(null);
  const pointSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Log initial state
  useEffect(() => {
    console.log("ScoringFullscreen mounted. ID:", id, "Type:", matchType);
    
    // Initialize audio elements
    startSoundRef.current = new Audio("/sounds/match-start.mp3");
    countdownSoundRef.current = new Audio("/sounds/countdown.mp3");
    penaltySoundRef.current = new Audio("/sounds/penalty.mp3");
    pointSoundRef.current = new Audio("/sounds/point.mp3");
    
    return () => {
      // Clean up audio resources
      startSoundRef.current = null;
      countdownSoundRef.current = null;
      penaltySoundRef.current = null;
      pointSoundRef.current = null;
    };
  }, [id, matchType]);
  
  // Watch for match start to play sound
  useEffect(() => {
    if (matchStarted && !matchPaused) {
      // Play start sound when match begins
      startSoundRef.current?.play();
    }
  }, [matchStarted, matchPaused]);
  
  // Watch for countdown to play countdown sound
  useEffect(() => {
    if (matchStarted && !matchPaused && time <= 10 && time > 0) {
      countdownSoundRef.current?.play();
    }
  }, [time, matchStarted, matchPaused]);
  
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
      console.log("Fetching match data for ID:", id, "Type:", matchType);
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

  // Compare previous penalties with current to detect changes
  const prevPenaltiesRef = useRef(penalties);
  
  useEffect(() => {
    // Check if penalties changed
    const prevPenalties = prevPenaltiesRef.current;
    
    // Check athlete1 penalties
    for (const type of ['jogai', 'chukoku', 'keikoku'] as const) {
      if (penalties.athlete1[type] > prevPenalties.athlete1[type]) {
        // Show penalty notification for athlete1
        setShowPenalty({
          visible: true,
          athlete: match?.athlete1.name || 'Atleta AKA',
          type: getPenaltyName(type)
        });
        penaltySoundRef.current?.play();
        
        // Hide notification after 3 seconds
        setTimeout(() => {
          setShowPenalty(null);
        }, 3000);
        break;
      }
    }
    
    // Check athlete2 penalties
    for (const type of ['jogai', 'chukoku', 'keikoku'] as const) {
      if (penalties.athlete2[type] > prevPenalties.athlete2[type]) {
        // Show penalty notification for athlete2
        setShowPenalty({
          visible: true,
          athlete: match?.athlete2.name || 'Atleta AO',
          type: getPenaltyName(type)
        });
        penaltySoundRef.current?.play();
        
        // Hide notification after 3 seconds
        setTimeout(() => {
          setShowPenalty(null);
        }, 3000);
        break;
      }
    }
    
    // Update ref with current penalties
    prevPenaltiesRef.current = penalties;
  }, [penalties, match]);
  
  // Compare previous scores with current to detect changes
  const prevScoresRef = useRef(scores);
  
  useEffect(() => {
    // Check if scores changed
    const prevScores = prevScoresRef.current;
    
    // Check if total score changed
    if (scores.athlete1.total > prevScores.athlete1.total || 
        scores.athlete2.total > prevScores.athlete2.total) {
      // Play point sound
      pointSoundRef.current?.play();
    }
    
    // Update ref with current scores
    prevScoresRef.current = scores;
  }, [scores]);

  // Get penalty name in Portuguese
  const getPenaltyName = (penaltyType: string): string => {
    switch (penaltyType) {
      case 'jogai': return 'Jogai (Saída da Área)';
      case 'chukoku': return 'Chukoku (Advertência)';
      case 'keikoku': return 'Keikoku (Penalidade)';
      default: return 'Penalidade';
    }
  };

  // Atualização dos pontos e tempo via mensagens
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
    
    // Solicitar estado atual
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
  
  // Cálculo de pontuação total - usando os valores já calculados vindos da tela principal
  const totalPoints1 = scores.athlete1.total || 0;
  const totalPoints2 = scores.athlete2.total || 0;
  
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
          ${!matchStarted || matchPaused ? "animate-pulse" : ""}
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
          
          {/* Penalties display */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {penalties.athlete1.jogai > 0 && (
              <PenaltyIndicator type="Jogai" count={penalties.athlete1.jogai} />
            )}
            {penalties.athlete1.chukoku > 0 && (
              <PenaltyIndicator type="Chukoku" count={penalties.athlete1.chukoku} />
            )}
            {penalties.athlete1.keikoku > 0 && (
              <PenaltyIndicator type="Keikoku" count={penalties.athlete1.keikoku} />
            )}
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
          
          {/* Penalties display */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {penalties.athlete2.jogai > 0 && (
              <PenaltyIndicator type="Jogai" count={penalties.athlete2.jogai} />
            )}
            {penalties.athlete2.chukoku > 0 && (
              <PenaltyIndicator type="Chukoku" count={penalties.athlete2.chukoku} />
            )}
            {penalties.athlete2.keikoku > 0 && (
              <PenaltyIndicator type="Keikoku" count={penalties.athlete2.keikoku} />
            )}
          </div>
          
          <div className="mt-auto">
            <div className="flex justify-between items-center bg-black/40 rounded-lg p-4">
              <span className="text-xl">Total de Pontos</span>
              <span className="text-5xl font-bold">{totalPoints2}</span>
            </div>
          </div>
        </div>
      </main>
      
      {/* Status do jogo */}
      <div className="py-2 px-6 bg-black/60 text-center">
        {!matchStarted ? (
          <span className="text-yellow-400 font-medium">Aguardando início da luta</span>
        ) : matchPaused ? (
          <span className="text-yellow-400 font-medium">Luta pausada</span>
        ) : (
          <span className="text-green-400 font-medium">Luta em andamento</span>
        )}
      </div>
      
      {/* Informações de rodapé */}
      <footer className="py-4 px-6 bg-black/50 flex justify-between items-center">
        <div className="text-lg text-white/70">
          Dojo Heiseikan - Campeonato de Karatê 2025
        </div>
        <div className="text-lg">
          {matchType === "kumite" ? "Combate" : "Kata"} - {match.category}
        </div>
      </footer>
      
      {/* Notification for penalties */}
      {showPenalty && showPenalty.visible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-red-500/80 text-white px-8 py-6 rounded-lg shadow-lg animate-pulse backdrop-blur-sm">
            <div className="flex items-center gap-3 text-2xl font-bold mb-2">
              <AlertTriangle className="h-8 w-8" />
              <h3>Penalidade</h3>
            </div>
            <p className="text-xl">{showPenalty.athlete}</p>
            <p className="text-lg opacity-90">{showPenalty.type}</p>
          </div>
        </div>
      )}
      
      {/* Hidden audio elements */}
      <audio src="/sounds/match-start.mp3" preload="auto" />
      <audio src="/sounds/countdown.mp3" preload="auto" />
      <audio src="/sounds/penalty.mp3" preload="auto" />
      <audio src="/sounds/point.mp3" preload="auto" />
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

// Component for displaying penalties
const PenaltyIndicator = ({ type, count }: { type: string, count: number }) => {
  if (count <= 0) return null;
  
  const getIcon = () => {
    switch (type.toLowerCase()) {
      case 'jogai': return <Flag className="h-4 w-4" />;
      case 'chukoku': return <AlertTriangle className="h-4 w-4" />;
      case 'keikoku': return <Minus className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="bg-yellow-600/30 border border-yellow-500/50 rounded px-3 py-2 text-center">
      <div className="flex items-center justify-center gap-1">
        {getIcon()}
        <span>{type}</span>
      </div>
      <div className="text-xl font-bold mt-1">{count}</div>
    </div>
  );
};

export default ScoringFullscreen;
