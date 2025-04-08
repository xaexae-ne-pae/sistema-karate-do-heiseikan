import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Play, RefreshCcw, X, Check, Timer, ExternalLink, Trophy, AlertTriangle, Flag, Minus, Clock, Award, Zap } from "lucide-react";

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
  const [matchPaused, setMatchPaused] = useState(true);
  
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
  
  // Timer logic
  useEffect(() => {
    let interval: number | undefined;
    
    if (matchStarted && !matchPaused && time > 0) {
      interval = window.setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setMatchPaused(true);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [matchStarted, matchPaused, time]);
  
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
  
  // Function to add score
  const addScore = (athlete: 'athlete1' | 'athlete2', scoreType: 'yuko' | 'wazari' | 'ippon') => {
    const scoreValues = { yuko: 1, wazari: 2, ippon: 4 };
    
    setScores(prev => {
      const newScore = { ...prev };
      newScore[athlete][scoreType] += 1;
      
      // Recalculate total
      newScore[athlete].total = (
        newScore[athlete].yuko * scoreValues.yuko +
        newScore[athlete].wazari * scoreValues.wazari +
        newScore[athlete].ippon * scoreValues.ippon
      );
      
      return newScore;
    });
    
    pointSoundRef.current?.play();
  };

  // Function to subtract score
  const subtractScore = (athlete: 'athlete1' | 'athlete2', scoreType: 'yuko' | 'wazari' | 'ippon') => {
    const scoreValues = { yuko: 1, wazari: 2, ippon: 4 };
    
    setScores(prev => {
      const newScore = { ...prev };
      if (newScore[athlete][scoreType] > 0) {
        newScore[athlete][scoreType] -= 1;
        
        // Recalculate total
        newScore[athlete].total = (
          newScore[athlete].yuko * scoreValues.yuko +
          newScore[athlete].wazari * scoreValues.wazari +
          newScore[athlete].ippon * scoreValues.ippon
        );
      }
      return newScore;
    });
  };

  // Function to add penalty
  const addPenalty = (athlete: 'athlete1' | 'athlete2', penaltyType: 'jogai' | 'chukoku' | 'keikoku') => {
    setPenalties(prev => {
      const newPenalties = { ...prev };
      newPenalties[athlete][penaltyType] += 1;
      return newPenalties;
    });
    
    penaltySoundRef.current?.play();
  };

  // Function to subtract penalty
  const subtractPenalty = (athlete: 'athlete1' | 'athlete2', penaltyType: 'jogai' | 'chukoku' | 'keikoku') => {
    setPenalties(prev => {
      const newPenalties = { ...prev };
      if (newPenalties[athlete][penaltyType] > 0) {
        newPenalties[athlete][penaltyType] -= 1;
      }
      return newPenalties;
    });
  };
  
  // Match control functions
  const startMatch = () => {
    setMatchStarted(true);
    setMatchPaused(false);
  };
  
  const pauseMatch = () => {
    setMatchPaused(true);
  };
  
  const resetMatch = () => {
    setTime(120);
    setScores({
      athlete1: { yuko: 0, wazari: 0, ippon: 0, total: 0 },
      athlete2: { yuko: 0, wazari: 0, ippon: 0, total: 0 }
    });
    setPenalties({
      athlete1: { jogai: 0, chukoku: 0, keikoku: 0 },
      athlete2: { jogai: 0, chukoku: 0, keikoku: 0 }
    });
    setMatchStarted(false);
    setMatchPaused(true);
  };
  
  if (!match) {
    return (
      <div className="min-h-screen w-full bg-black flex items-center justify-center">
        <p className="text-2xl text-white">Carregando...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with timer and controls */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-4xl font-mono font-bold">
              {formatTime(time)}
            </div>
            
            <button 
              onClick={matchPaused ? startMatch : pauseMatch} 
              className="bg-red-600 text-white rounded-md px-6 py-2 flex items-center gap-2 hover:bg-red-700 transition-colors"
            >
              <Play size={18} />
              <span>Iniciar</span>
            </button>
            
            <button 
              onClick={resetMatch}
              className="bg-gray-800 text-white rounded-md px-6 py-2 flex items-center gap-2 hover:bg-gray-700 transition-colors"
            >
              <RefreshCcw size={18} />
              <span>Reiniciar</span>
            </button>
          </div>
          
          <div className="rounded-md bg-gray-800 px-6 py-2">
            {!matchStarted ? (
              <span>Não iniciado</span>
            ) : matchPaused ? (
              <span>Pausado</span>
            ) : (
              <span>Em andamento</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button className="bg-gray-900 text-white rounded-md px-4 py-2 flex items-center gap-2 hover:bg-gray-800 transition-colors">
              <X size={18} />
              <span>Cancelar</span>
            </button>
            
            <button className="bg-red-600 text-white rounded-md px-6 py-2 flex items-center gap-2 hover:bg-red-700 transition-colors">
              <Check size={18} />
              <span>Salvar</span>
            </button>
            
            <button className="bg-transparent border border-gray-700 rounded-md p-2 text-gray-300 hover:bg-gray-800 transition-colors">
              <ExternalLink size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Pontuação de Kumite</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AKA (Athlete 1) scoring panel */}
          <div className="bg-[#1a0d0d] rounded-lg overflow-hidden">
            {/* Athlete header */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
              </div>
              <div className="bg-red-500 text-white rounded-full px-4 py-1">
                AKA
              </div>
            </div>
            
            {/* Scoring section */}
            <div className="p-4 grid grid-cols-3 gap-4">
              {/* Yuko */}
              <div className="bg-[#24191a] rounded-lg p-4">
                <div className="text-lg">Yuko</div>
                <div className="text-sm text-gray-400 mb-2">1 ponto</div>
                <div className="flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-xl font-bold mb-4">
                    {scores.athlete1.yuko}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => addScore('athlete1', 'yuko')}
                    className="bg-gray-800 hover:bg-gray-700 rounded p-2 flex items-center justify-center"
                  >
                    +
                  </button>
                  <button 
                    onClick={() => subtractScore('athlete1', 'yuko')}
                    className="bg-gray-800 hover:bg-gray-700 rounded p-2 flex items-center justify-center"
                  >
                    -
                  </button>
                </div>
              </div>
              
              {/* Wazari */}
              <div className="bg-[#24191a] rounded-lg p-4">
                <div className="text-lg">Wazari</div>
                <div className="text-sm text-gray-400 mb-2">2 pontos</div>
                <div className="flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-xl font-bold mb-4">
                    {scores.athlete1.wazari}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => addScore('athlete1', 'wazari')}
                    className="bg-gray-800 hover:bg-gray-700 rounded p-2 flex items-center justify-center"
                  >
                    +
                  </button>
                  <button 
                    onClick={() => subtractScore('athlete1', 'wazari')}
                    className="bg-gray-800 hover:bg-gray-700 rounded p-2 flex items-center justify-center"
                  >
                    -
                  </button>
                </div>
              </div>
              
              {/* Ippon */}
              <div className="bg-[#24191a] rounded-lg p-4">
                <div className="text-lg">Ippon</div>
                <div className="text-sm text-gray-400 mb-2">4 pontos</div>
                <div className="flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-xl font-bold mb-4">
                    {scores.athlete1.ippon}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => addScore('athlete1', 'ippon')}
                    className="bg-gray-800 hover:bg-gray-700 rounded p-2 flex items-center justify-center"
                  >
                    +
                  </button>
                  <button 
                    onClick={() => subtractScore('athlete1', 'ippon')}
                    className="bg-gray-800 hover:bg-gray-700 rounded p-2 flex items-center justify-center"
                  >
                    -
                  </button>
                </div>
              </div>
            </div>
            
            {/* Penalty section */}
            <div className="p-4 grid grid-cols-3 gap-4">
              {/* Jogai */}
              <div className="bg-[#24191a] rounded-lg p-4">
                <div className="text-lg">Jogai</div>
                <div className="flex justify-center">
                  <div className="w-12 h-12 rounded-full border-2 border-yellow-500 text-yellow-500 flex items-center justify-center text-xl font-bold mb-4">
                    {penalties.athlete1.jogai}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => addPenalty('athlete1', 'jogai')}
                    className="bg-gray-800 hover:bg-gray-700 rounded p-2 flex items-center justify-center border border-yellow-600/30"
                  >
                    +
                  </button>
                  <button 
                    onClick={() => subtractPenalty('athlete1', 'jogai')}
                    className="bg-gray-800 hover:bg-gray-700 rounded p-2 flex items-center justify-center"
                  >
                    -
                  </button>
                </div>
              </div>
              
              {/* Chukoku */}
              <div className="bg-[#24191a] rounded-lg p-4">
                <div className="text-lg">Chukoku</div>
                <div className="flex justify-center">
                  <div className="w-12 h-12 rounded-full border-2 border-yellow-500 text-yellow-500 flex items-center justify-center text-xl font-bold mb-4">
                    {penalties.athlete1.chukoku}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => addPenalty('athlete1', 'chukoku')}
                    className="bg-gray-800 hover:bg-gray-700 rounded p-2 flex items-center justify-center border border-yellow-600/30"
                  >
                    +
                  </button>
                  <button 
                    onClick={() => subtractPenalty('athlete1', 'chukoku')}
                    className="bg-gray-800 hover:bg-gray-700 rounded p-2 flex items-center justify-center"
                  >
                    -
                  </button>
                </div>
              </div>
              
              {/* Keikoku */}
              <div className="bg-[#24191a] rounded-lg p-4">
                <div className="text-lg">Keikoku</div>
                <div className="flex justify-center">
                  <div className="w-12 h-12 rounded-full border-2 border-yellow-500 text-yellow-500 flex items-center justify-center text-xl font-bold mb-4">
                    {penalties.athlete1.keikoku}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => addPenalty('athlete1', 'keikoku')}
                    className="bg-gray-800 hover:bg-gray-700 rounded p-2 flex items-center justify-center border border-yellow-600/30"
                  >
                    +
                  </button>
                  <button 
                    onClick={() => subtractPenalty('athlete1', 'keikoku')}
                    className="bg-gray-800 hover:bg-gray-700 rounded p-2 flex items-center justify-center"
                  >
                    -
                  </button>
                </div>
              </div>
            </div>
            
            {/* Total */}
            <div className="p-4">
              <div className="flex justify-between items-center bg-[#24191a] p-4 rounded-lg">
                <div className="text-lg">Total de pontos</div>
                <div className="text-4xl font-bold">{scores.athlete1.total}</div>
              </div>
            </div>
          </div>
          
          {/* AO (Athlete 2) scoring panel */}
          <div className="bg-[#0d1119] rounded-lg overflow-hidden">
            {/* Athlete header */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              </div>
              <div className="bg-blue-500 text-white rounded-full px-4 py-1">
                AO
              </div>
            </div>
            
            {/* Scoring section */}
            <div className="p-4 grid grid-cols-3 gap-4">
              {/* Yuko */}
              <div className="bg-[#161d29] rounded-lg p-4">
                <div className="text-lg">Yuko</div>
                <div className="text-sm text-gray-400 mb-2">1 ponto</div>
                <div className="flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold mb-4">
                    {scores.athlete2.yuko}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => addScore('athlete2', 'yuko')}
                    className="bg-gray-800 hover:bg-gray-700 rounded p-2 flex items-center justify-center"
                  >
                    +
                  </button>
                  <button 
                    onClick={() => subtractScore('athlete2', 'yuko')}
                    className="bg-gray-800 hover:bg-gray-700 rounded p-2 flex items-center justify-center"
                  >
                    -
                  </button>
                </div>
              </div>
              
              {/* Wazari */}
              <div className="bg-[#161d29] rounded-lg p-4">
                <div className="text-lg">Wazari</div>
                <div className="text-sm text-gray-400 mb-2">2 pontos</div>
                <div className="flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold mb-4">
                    {scores.athlete2.wazari}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => addScore('athlete2', 'wazari')}
                    className="bg-gray-800 hover:bg-gray-700 rounded p-2 flex items-center justify-center"
                  >
                    +
                  </button>
                  <button 
                    onClick={() => subtractScore('athlete2', 'wazari')}
                    className="bg-gray-800 hover:bg-gray-700 rounded p-2 flex items-center justify-center"
                  >
                    -
                  </button>
                </div>
              </div>
              
              {/* Ippon */}
              <div className="bg-[#161d29] rounded-lg p-4">
                <div className="text-lg">Ippon</div>
                <div className="text-sm text-gray-400 mb-2">4 pontos</div>
                <div className="flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold mb-4">
                    {scores.athlete2.ippon}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => addScore('athlete2', 'ippon')}
                    className="bg-gray-800 hover:bg-gray-700 rounded p-2 flex items-center justify-center"
                  >
                    +
                  </button>
                  <button 
                    onClick={() => subtractScore('athlete2', 'ippon')}
                    className="bg-gray-800 hover:bg-gray-700 rounded p-2 flex items-center justify-center"
                  >
                    -
                  </button>
                </div>
              </div>
            </div>
            
            {/* Penalty section */}
            <div className="p-4 grid grid-cols-3 gap-4">
              {/* Jogai */}
              <div className="bg-[#161d29] rounded-lg p-4">
                <div className="text-lg">Jogai</div>
                <div className="flex justify-center">
                  <div className="w-12 h-12 rounded-full border-2 border-yellow-500 text-yellow-500 flex items-center justify-center text-xl font-bold mb-4">
                    {penalties.athlete2.jogai}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => addPenalty('athlete2', 'jogai')}
                    className="bg-gray-800 hover:bg-gray-700 rounded p-2 flex items-center justify-center border border-yellow-600/30"
                  >
                    +
                  </button>
                  <button 
                    onClick={() => subtractPenalty('athlete2', 'jogai')}
                    className="bg-gray-800 hover:bg-gray-700 rounded p-2 flex items-center justify-center"
                  >
                    -
                  </button>
                </div>
              </div>
              
              {/* Chukoku */}
              <div className="bg-[#161d29] rounded-lg p-4">
                <div className="text-lg">Chukoku</div>
                <div className="flex justify-center">
                  <div className="w-12 h-12 rounded-full border-2 border-yellow-500 text-yellow-500 flex items-center justify-center text-xl font-bold mb-4">
                    {penalties.athlete2.chukoku}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => addPenalty('athlete2', 'chukoku')}
                    className="bg-gray-800 hover:bg-gray-700 rounded p-2 flex items-center justify-center border border-yellow-600/30"
                  >
                    +
                  </button>
                  <button 
                    onClick={() => subtractPenalty('athlete2', 'chukoku')}
                    className="bg-gray-800 hover:bg-gray-700 rounded p-2 flex items-center justify-center"
                  >
                    -
                  </button>
                </div>
              </div>
              
              {/* Keikoku */}
              <div className="bg-[#161d29] rounded-lg p-4">
                <div className="text-lg">Keikoku</div>
                <div className="flex justify-center">
                  <div className="w-12 h-12 rounded-full border-2 border-yellow-500 text-yellow-500 flex items-center justify-center text-xl font-bold mb-4">
                    {penalties.athlete2.keikoku}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => addPenalty('athlete2', 'keikoku')}
                    className="bg-gray-800 hover:bg-gray-700 rounded p-2 flex items-center justify-center border border-yellow-600/30"
                  >
                    +
                  </button>
                  <button 
                    onClick={() => subtractPenalty('athlete2', 'keikoku')}
                    className="bg-gray-800 hover:bg-gray-700 rounded p-2 flex items-center justify-center"
                  >
                    -
                  </button>
                </div>
              </div>
            </div>
            
            {/* Total */}
            <div className="p-4">
              <div className="flex justify-between items-center bg-[#161d29] p-4 rounded-lg">
                <div className="text-lg">Total de pontos</div>
                <div className="text-4xl font-bold">{scores.athlete2.total}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Audio elements */}
      <audio src="/sounds/match-start.mp3" preload="auto" />
      <audio src="/sounds/countdown.mp3" preload="auto" />
      <audio src="/sounds/penalty.mp3" preload="auto" />
      <audio src="/sounds/point.mp3" preload="auto" />
    </div>
  );
};

export default ScoringFullscreen;
