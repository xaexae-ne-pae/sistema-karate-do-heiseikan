import { useState, useRef, useEffect } from "react";
import { TournamentSidebar } from "@/components/TournamentSidebar";
import { Button } from "@/components/ui/button";
import { 
  Award, Download, Filter, Plus, Timer, User, Users, Trophy, 
  AlertTriangle, Flag, Check, X, RefreshCw, Play, Pause, Star, 
  Minus, ExternalLink, StopCircle
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";

// Mock Data
const MOCK_SCORING_DATA = [
  { id: 1, athlete: "João Silva", category: "Kata Masculino", score: 8.5, round: "Eliminatória" },
  { id: 2, athlete: "Maria Oliveira", category: "Kata Feminino", score: 9.2, round: "Final" },
  { id: 3, athlete: "Pedro Santos", category: "Kumite -75kg", score: 7.8, round: "Semifinal" },
  { id: 4, athlete: "Ana Costa", category: "Kata Feminino", score: 8.7, round: "Eliminatória" },
  { id: 5, athlete: "Carlos Ferreira", category: "Kumite -60kg", score: 8.9, round: "Final" },
];

const MOCK_ATHLETES = [
  { id: 1, name: "João Silva", category: "Kata Masculino", age: 24, belt: "Preta" },
  { id: 2, name: "Maria Oliveira", category: "Kata Feminino", age: 22, belt: "Preta" },
  { id: 3, name: "Pedro Santos", category: "Kumite -75kg", age: 26, belt: "Preta" },
  { id: 4, name: "Ana Costa", category: "Kata Feminino", age: 20, belt: "Marrom" },
  { id: 5, name: "Carlos Ferreira", category: "Kumite -60kg", age: 19, belt: "Preta" },
  { id: 6, name: "Juliana Lima", category: "Kumite -61kg", age: 21, belt: "Preta" },
  { id: 7, name: "Fernando Alves", category: "Kata Masculino", age: 25, belt: "Marrom" },
];

const MOCK_CATEGORIES = [
  { id: 1, name: "Kata Masculino", gender: "Masculino", type: "kata" },
  { id: 2, name: "Kata Feminino", gender: "Feminino", type: "kata" },
  { id: 3, name: "Kumite -75kg", gender: "Masculino", type: "kumite" },
  { id: 4, name: "Kumite -61kg", gender: "Feminino", type: "kumite" },
  { id: 5, name: "Kumite -60kg", gender: "Masculino", type: "kumite" },
];

const MOCK_MATCHES = [
  { 
    id: 1, 
    category: "Kumite Masculino -75kg", 
    athlete1: { id: 3, name: "Pedro Santos", color: "red" },
    athlete2: { id: 5, name: "Carlos Ferreira", color: "blue" },
    type: "kumite"
  },
  { 
    id: 2, 
    category: "Kumite Feminino -61kg", 
    athlete1: { id: 6, name: "Juliana Lima", color: "red" },
    athlete2: { id: 2, name: "Maria Oliveira", color: "blue" },
    type: "kumite"
  },
  { 
    id: 3, 
    category: "Kata Masculino", 
    athlete1: { id: 1, name: "João Silva", color: "red" },
    athlete2: { id: 7, name: "Fernando Alves", color: "blue" },
    type: "kata"
  },
  { 
    id: 4, 
    category: "Kata Feminino", 
    athlete1: { id: 2, name: "Maria Oliveira", color: "red" },
    athlete2: { id: 4, name: "Ana Costa", color: "blue" },
    type: "kata"
  }
];

const TournamentScoring = () => {
  const navigate = useNavigate();
  const { id: tournamentId } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  // States for scoring and match control
  const [activeTab, setActiveTab] = useState("all");
  const [activeMatch, setActiveMatch] = useState<any>(null);
  const [isKumiteScoring, setIsKumiteScoring] = useState(false);
  const [isKataScoring, setIsKataScoring] = useState(false);
  const [showCreateMatchDialog, setShowCreateMatchDialog] = useState(false);
  const [showScoreKataDialog, setShowScoreKataDialog] = useState(false);
  
  // Kumite scoring state
  const [kumiteTime, setKumiteTime] = useState(120); // 2 minutes in seconds
  const [kumiteScores, setKumiteScores] = useState({
    athlete1: { yuko: 0, wazari: 0, ippon: 0, total: 0 },
    athlete2: { yuko: 0, wazari: 0, ippon: 0, total: 0 }
  });
  const [kumitePenalties, setKumitePenalties] = useState({
    athlete1: { jogai: 0, chukoku: 0, keikoku: 0 },
    athlete2: { jogai: 0, chukoku: 0, keikoku: 0 }
  });
  const [matchStarted, setMatchStarted] = useState(false);
  const [matchPaused, setMatchPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Kata scoring state
  const [kataScores, setKataScores] = useState({
    judge1: 0,
    judge2: 0,
    judge3: 0,
    total: 0
  });
  
  // Ref for fullscreen window
  const fullscreenWindowRef = useRef<Window | null>(null);
  
  // Form state for creating match
  const [newMatch, setNewMatch] = useState({
    category: "",
    athlete1: "",
    athlete2: "",
    type: "kumite"
  });
  
  // Handle new match form change
  const handleNewMatchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewMatch(prev => ({ ...prev, [name]: value }));
  };
  
  // Open fullscreen scoring window
  const openFullscreenScoring = () => {
    if (!activeMatch) return;
    
    const url = `/torneios/${tournamentId}/pontuacao/fullscreen?type=${activeMatch.type}`;
    
    // Open new window and keep reference
    const win = window.open(url, "fullscreenScoring", "fullscreen=yes");
    if (win) {
      fullscreenWindowRef.current = win;
      
      // Wait a bit for the window to load, then send initial data
      setTimeout(() => {
        if (fullscreenWindowRef.current) {
          fullscreenWindowRef.current.postMessage({
            type: 'UPDATE_SCORES',
            scores: kumiteScores
          }, '*');
          
          fullscreenWindowRef.current.postMessage({
            type: 'UPDATE_TIME',
            time: kumiteTime,
            matchStarted,
            matchPaused
          }, '*');
          
          fullscreenWindowRef.current.postMessage({
            type: 'UPDATE_PENALTIES',
            penalties: kumitePenalties
          }, '*');
        }
      }, 1000);
    }
  };
  
  // Calculate kumite score totals
  const calculateKumiteTotal = () => {
    const athlete1Total = 
      kumiteScores.athlete1.yuko * 1 + 
      kumiteScores.athlete1.wazari * 2 + 
      kumiteScores.athlete1.ippon * 4;
      
    const athlete2Total = 
      kumiteScores.athlete2.yuko * 1 + 
      kumiteScores.athlete2.wazari * 2 + 
      kumiteScores.athlete2.ippon * 4;
    
    setKumiteScores(prev => ({
      ...prev,
      athlete1: { ...prev.athlete1, total: athlete1Total },
      athlete2: { ...prev.athlete2, total: athlete2Total }
    }));
    
    // Send updated scores to fullscreen window
    if (fullscreenWindowRef.current) {
      fullscreenWindowRef.current.postMessage({
        type: 'UPDATE_SCORES',
        scores: {
          athlete1: { ...kumiteScores.athlete1, total: athlete1Total },
          athlete2: { ...kumiteScores.athlete2, total: athlete2Total }
        }
      }, '*');
    }
  };
  
  // Update kumite score
  const updateKumiteScore = (athlete: 'athlete1' | 'athlete2', scoreType: 'yuko' | 'wazari' | 'ippon', increment: boolean = true) => {
    setKumiteScores(prev => {
      const newValue = increment 
        ? prev[athlete][scoreType] + 1 
        : Math.max(0, prev[athlete][scoreType] - 1);
      
      return {
        ...prev,
        [athlete]: {
          ...prev[athlete],
          [scoreType]: newValue
        }
      };
    });
  };
  
  // Update kumite penalty
  const updateKumitePenalty = (athlete: 'athlete1' | 'athlete2', penaltyType: 'jogai' | 'chukoku' | 'keikoku', increment: boolean = true) => {
    setKumitePenalties(prev => {
      const newValue = increment 
        ? prev[athlete][penaltyType] + 1 
        : Math.max(0, prev[athlete][penaltyType] - 1);
      
      return {
        ...prev,
        [athlete]: {
          ...prev[athlete],
          [penaltyType]: newValue
        }
      };
    });
    
    // Send updated penalties to fullscreen window
    if (fullscreenWindowRef.current) {
      setTimeout(() => {
        if (fullscreenWindowRef.current) {
          fullscreenWindowRef.current.postMessage({
            type: 'UPDATE_PENALTIES',
            penalties: kumitePenalties
          }, '*');
        }
      }, 100);
    }
  };
  
  // Format time to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };
  
  // Start/stop match timer
  const toggleMatchTimer = () => {
    if (!matchStarted) {
      // Start match
      setMatchStarted(true);
      setMatchPaused(false);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setKumiteTime(prevTime => {
          const newTime = Math.max(0, prevTime - 1);
          
          // Send updated time to fullscreen window
          if (fullscreenWindowRef.current) {
            fullscreenWindowRef.current.postMessage({
              type: 'UPDATE_TIME',
              time: newTime,
              matchStarted: true,
              matchPaused: false
            }, '*');
          }
          
          // Stop timer when time reaches 0
          if (newTime === 0 && timerRef.current) {
            clearInterval(timerRef.current);
            toast({
              title: "Tempo esgotado!",
              description: "O tempo da luta chegou ao fim.",
              variant: "destructive"
            });
          }
          
          return newTime;
        });
      }, 1000);
      
    } else if (matchPaused) {
      // Resume match
      setMatchPaused(false);
      
      // Resume timer
      timerRef.current = setInterval(() => {
        setKumiteTime(prevTime => {
          const newTime = Math.max(0, prevTime - 1);
          
          // Send updated time to fullscreen window
          if (fullscreenWindowRef.current) {
            fullscreenWindowRef.current.postMessage({
              type: 'UPDATE_TIME',
              time: newTime,
              matchStarted: true,
              matchPaused: false
            }, '*');
          }
          
          // Stop timer when time reaches 0
          if (newTime === 0 && timerRef.current) {
            clearInterval(timerRef.current);
            toast({
              title: "Tempo esgotado!",
              description: "O tempo da luta chegou ao fim.",
              variant: "destructive"
            });
          }
          
          return newTime;
        });
      }, 1000);
      
    } else {
      // Pause match
      setMatchPaused(true);
      
      // Pause timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Send updated state to fullscreen window
      if (fullscreenWindowRef.current) {
        fullscreenWindowRef.current.postMessage({
          type: 'UPDATE_TIME',
          time: kumiteTime,
          matchStarted: true,
          matchPaused: true
        }, '*');
      }
    }
  };
  
  // Reset match
  const resetMatch = () => {
    // Confirm reset
    if (!window.confirm("Deseja realmente resetar a luta? Todos os dados serão perdidos.")) {
      return;
    }
    
    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Reset state
    setKumiteTime(120);
    setKumiteScores({
      athlete1: { yuko: 0, wazari: 0, ippon: 0, total: 0 },
      athlete2: { yuko: 0, wazari: 0, ippon: 0, total: 0 }
    });
    setKumitePenalties({
      athlete1: { jogai: 0, chukoku: 0, keikoku: 0 },
      athlete2: { jogai: 0, chukoku: 0, keikoku: 0 }
    });
    setMatchStarted(false);
    setMatchPaused(false);
    
    // Send reset state to fullscreen window
    if (fullscreenWindowRef.current) {
      fullscreenWindowRef.current.postMessage({
        type: 'UPDATE_TIME',
        time: 120,
        matchStarted: false,
        matchPaused: false
      }, '*');
      
      fullscreenWindowRef.current.postMessage({
        type: 'UPDATE_SCORES',
        scores: {
          athlete1: { yuko: 0, wazari: 0, ippon: 0, total: 0 },
          athlete2: { yuko: 0, wazari: 0, ippon: 0, total: 0 }
        }
      }, '*');
      
      fullscreenWindowRef.current.postMessage({
        type: 'UPDATE_PENALTIES',
        penalties: {
          athlete1: { jogai: 0, chukoku: 0, keikoku: 0 },
          athlete2: { jogai: 0, chukoku: 0, keikoku: 0 }
        }
      }, '*');
    }
    
    toast({
      title: "Luta reiniciada",
      description: "Todos os dados da luta foram reiniciados.",
    });
  };
  
  // Calculate and save kata score
  const calculateKataScore = () => {
    const total = (kataScores.judge1 + kataScores.judge2 + kataScores.judge3) / 3;
    setKataScores(prev => ({ ...prev, total: parseFloat(total.toFixed(2)) }));
    
    // Close dialog
    setShowScoreKataDialog(false);
    
    // Notify score saved
    toast({
      title: "Pontuação salva",
      description: `Pontuação total: ${total.toFixed(2)}`,
    });
    
    // Return to matches list
    setIsKataScoring(false);
    setActiveMatch(null);
  };
  
  // Create new match
  const createNewMatch = () => {
    // Validation
    if (!newMatch.category || !newMatch.athlete1 || !newMatch.athlete2) {
      toast({
        title: "Erro ao criar luta",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Luta criada",
      description: "Nova luta adicionada com sucesso.",
    });
    
    setShowCreateMatchDialog(false);
    
    // Reset form
    setNewMatch({
      category: "",
      athlete1: "",
      athlete2: "",
      type: "kumite"
    });
  };
  
  // Save kumite score
  const saveKumiteScore = () => {
    toast({
      title: "Pontuação salva",
      description: "Pontuação da luta salva com sucesso.",
    });
    
    // Exit kumite scoring mode
    setIsKumiteScoring(false);
    setActiveMatch(null);
    
    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Reset state for next match
    setKumiteTime(120);
    setKumiteScores({
      athlete1: { yuko: 0, wazari: 0, ippon: 0, total: 0 },
      athlete2: { yuko: 0, wazari: 0, ippon: 0, total: 0 }
    });
    setKumitePenalties({
      athlete1: { jogai: 0, chukoku: 0, keikoku: 0 },
      athlete2: { jogai: 0, chukoku: 0, keikoku: 0 }
    });
    setMatchStarted(false);
    setMatchPaused(false);
    
    // Close fullscreen window if open
    if (fullscreenWindowRef.current && !fullscreenWindowRef.current.closed) {
      fullscreenWindowRef.current.close();
      fullscreenWindowRef.current = null;
    }
  };
  
  // Start scoring a kata match
  const startKataScoring = (match: any) => {
    setActiveMatch(match);
    setIsKataScoring(true);
    
    // Reset kata scores
    setKataScores({
      judge1: 0,
      judge2: 0,
      judge3: 0,
      total: 0
    });
  };
  
  // Start scoring a kumite match
  const startKumiteScoring = (match: any) => {
    setActiveMatch(match);
    setIsKumiteScoring(true);
    
    // Reset kumite state
    setKumiteTime(120);
    setKumiteScores({
      athlete1: { yuko: 0, wazari: 0, ippon: 0, total: 0 },
      athlete2: { yuko: 0, wazari: 0, ippon: 0, total: 0 }
    });
    setKumitePenalties({
      athlete1: { jogai: 0, chukoku: 0, keikoku: 0 },
      athlete2: { jogai: 0, chukoku: 0, keikoku: 0 }
    });
    setMatchStarted(false);
    setMatchPaused(false);
  };
  
  // Calculate kumite total after score changes
  useEffect(() => {
    calculateKumiteTotal();
  }, [kumiteScores.athlete1.yuko, kumiteScores.athlete1.wazari, kumiteScores.athlete1.ippon, 
      kumiteScores.athlete2.yuko, kumiteScores.athlete2.wazari, kumiteScores.athlete2.ippon]);
  
  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  // Listen for messages from fullscreen window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'REQUEST_STATE') {
        // Fullscreen window is requesting current state
        if (fullscreenWindowRef.current) {
          fullscreenWindowRef.current.postMessage({
            type: 'UPDATE_SCORES',
            scores: kumiteScores
          }, '*');
          
          fullscreenWindowRef.current.postMessage({
            type: 'UPDATE_TIME',
            time: kumiteTime,
            matchStarted,
            matchPaused
          }, '*');
          
          fullscreenWindowRef.current.postMessage({
            type: 'UPDATE_PENALTIES',
            penalties: kumitePenalties
          }, '*');
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [kumiteScores, kumiteTime, matchStarted, matchPaused, kumitePenalties]);
  
  // Close fullscreen window on unmount
  useEffect(() => {
    return () => {
      if (fullscreenWindowRef.current && !fullscreenWindowRef.current.closed) {
        fullscreenWindowRef.current.close();
      }
    };
  }, []);
  
  return (
    <div className="flex min-h-screen bg-background">
      <TournamentSidebar />
      
      <div className="flex-1 md:ml-64">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b bg-background/95 px-8 py-4 backdrop-blur">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Pontuação do Torneio</h1>
            <p className="text-muted-foreground">Gerenciar pontuações e avaliações</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              <span>Filtrar</span>
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              <span>Exportar</span>
            </Button>
            <Button className="gap-2" onClick={() => setShowCreateMatchDialog(true)}>
              <Plus className="h-4 w-4" />
              <span>Nova Luta</span>
            </Button>
          </div>
        </header>
        
        <main className="px-8 py-6">
          {/* Kumite Scoring Interface */}
          {isKumiteScoring && activeMatch && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Pontuação de Kumite</h2>
                  <p className="text-muted-foreground">{activeMatch.category}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsKumiteScoring(false);
                      setActiveMatch(null);
                      
                      // Stop timer
                      if (timerRef.current) {
                        clearInterval(timerRef.current);
                      }
                      
                      // Close fullscreen window if open
                      if (fullscreenWindowRef.current && !fullscreenWindowRef.current.closed) {
                        fullscreenWindowRef.current.close();
                        fullscreenWindowRef.current = null;
                      }
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button onClick={saveKumiteScore}>
                    <Check className="h-4 w-4 mr-2" />
                    Salvar Pontuação
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Timer and Controls */}
                <Card className="md:col-span-3">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className={`text-4xl font-mono font-bold w-28 text-center py-3 px-4 rounded-lg ${
                          kumiteTime <= 10 ? "text-red-500 bg-red-500/10" : "bg-muted/30"
                        }`}>
                          {formatTime(kumiteTime)}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button 
                            className="gap-2 w-full" 
                            onClick={toggleMatchTimer}
                          >
                            {!matchStarted ? (
                              <>
                                <Play className="h-4 w-4" />
                                <span>Iniciar</span>
                              </>
                            ) : matchPaused ? (
                              <>
                                <Play className="h-4 w-4" />
                                <span>Continuar</span>
                              </>
                            ) : (
                              <>
                                <Pause className="h-4 w-4" />
                                <span>Pausar</span>
                              </>
                            )}
                          </Button>
                          <Button 
                            variant="outline"
                            className="gap-2 w-full" 
                            onClick={resetMatch}
                          >
                            <RefreshCw className="h-4 w-4" />
                            <span>Reiniciar</span>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Badge variant={matchStarted ? (matchPaused ? "outline" : "default") : "secondary"} className="px-4 py-2 text-base">
                          {matchStarted ? (matchPaused ? "Pausado" : "Em andamento") : "Não iniciado"}
                        </Badge>
                      </div>
                      
                      <div>
                        <Button 
                          className="gap-2" 
                          variant="outline"
                          onClick={openFullscreenScoring}
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>Abrir Tela Cheia</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Athlete 1 Scoring */}
                <Card className="border-red-500/30">
                  <CardHeader className="bg-red-950/10">
                    <CardTitle className="flex items-center justify-between">
                      <span>{activeMatch.athlete1.name}</span>
                      <Badge className="bg-red-500/90">AKA</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {/* Points */}
                    <div>
                      <h3 className="font-semibold mb-4">Pontos</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Yuko (1 ponto)</span>
                            <Badge>{kumiteScores.athlete1.yuko}</Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => updateKumiteScore('athlete1', 'yuko', true)}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              <span>Add</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => updateKumiteScore('athlete1', 'yuko', false)}
                              disabled={kumiteScores.athlete1.yuko <= 0}
                            >
                              <Minus className="h-3 w-3 mr-1" />
                              <span>Sub</span>
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Wazari (2 pontos)</span>
                            <Badge>{kumiteScores.athlete1.wazari}</Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => updateKumiteScore('athlete1', 'wazari', true)}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              <span>Add</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => updateKumiteScore('athlete1', 'wazari', false)}
                              disabled={kumiteScores.athlete1.wazari <= 0}
                            >
                              <Minus className="h-3 w-3 mr-1" />
                              <span>Sub</span>
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Ippon (4 pontos)</span>
                            <Badge>{kumiteScores.athlete1.ippon}</Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => updateKumiteScore('athlete1', 'ippon', true)}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              <span>Add</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => updateKumiteScore('athlete1', 'ippon', false)}
                              disabled={kumiteScores.athlete1.ippon <= 0}
                            >
                              <Minus className="h-3 w-3 mr-1" />
                              <span>Sub</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Penalties */}
                    <div>
                      <h3 className="font-semibold mb-4">Penalidades</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Jogai</span>
                            <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                              {kumitePenalties.athlete1.jogai}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1 border-yellow-500/30 text-yellow-500"
                              onClick={() => updateKumitePenalty('athlete1', 'jogai', true)}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              <span>Add</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => updateKumitePenalty('athlete1', 'jogai', false)}
                              disabled={kumitePenalties.athlete1.jogai <= 0}
                            >
                              <Minus className="h-3 w-3 mr-1" />
                              <span>Sub</span>
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Chukoku</span>
                            <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                              {kumitePenalties.athlete1.chukoku}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1 border-yellow-500/30 text-yellow-500"
                              onClick={() => updateKumitePenalty('athlete1', 'chukoku', true)}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              <span>Add</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => updateKumitePenalty('athlete1', 'chukoku', false)}
                              disabled={kumitePenalties.athlete1.chukoku <= 0}
                            >
                              <Minus className="h-3 w-3 mr-1" />
                              <span>Sub</span>
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Keikoku</span>
                            <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                              {kumitePenalties.athlete1.keikoku}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1 border-yellow-500/30 text-yellow-500"
                              onClick={() => updateKumitePenalty('athlete1', 'keikoku', true)}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              <span>Add</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => updateKumitePenalty('athlete1', 'keikoku', false)}
                              disabled={kumitePenalties.athlete1.keikoku <= 0}
                            >
                              <Minus className="h-3 w-3 mr-1" />
                              <span>Sub</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Total */}
                    <div className="mt-6 pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total de pontos</span>
                        <div className="text-3xl font-bold">{kumiteScores.athlete1.total}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Athlete 2 Scoring */}
                <Card className="border-blue-500/30">
                  <CardHeader className="bg-blue-950/10">
                    <CardTitle className="flex items-center justify-between">
                      <span>{activeMatch.athlete2.name}</span>
                      <Badge className="bg-blue-500/90">AO</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {/* Points */}
                    <div>
                      <h3 className="font-semibold mb-4">Pontos</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Yuko (1 ponto)</span>
                            <Badge>{kumiteScores.athlete2.yuko}</Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => updateKumiteScore('athlete2', 'yuko', true)}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              <span>Add</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => updateKumiteScore('athlete2', 'yuko', false)}
                              disabled={kumiteScores.athlete2.yuko <= 0}
                            >
                              <Minus className="h-3 w-3 mr-1" />
                              <span>Sub</span>
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Wazari (2 pontos)</span>
                            <Badge>{kumiteScores.athlete2.wazari}</Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => updateKumiteScore('athlete2', 'wazari', true)}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              <span>Add</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => updateKumiteScore('athlete2', 'wazari', false)}
                              disabled={kumiteScores.athlete2.wazari <= 0}
                            >
                              <Minus className="h-3 w-3 mr-1" />
                              <span>Sub</span>
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Ippon (4 pontos)</span>
                            <Badge>{kumiteScores.athlete2.ippon}</Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => updateKumiteScore('athlete2', 'ippon', true)}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              <span>Add</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => updateKumiteScore('athlete2', 'ippon', false)}
                              disabled={kumiteScores.athlete2.ippon <= 0}
                            >
                              <Minus className="h-3 w-3 mr-1" />
                              <span>Sub</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Penalties */}
                    <div>
                      <h3 className="font-semibold mb-4">Penalidades</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Jogai</span>
                            <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                              {kumitePenalties.athlete2.jogai}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1 border-yellow-500/30 text-yellow-500"
                              onClick={() => updateKumitePenalty('athlete2', 'jogai', true)}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              <span>Add</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => updateKumitePenalty('athlete2', 'jogai', false)}
                              disabled={kumitePenalties.athlete2.jogai <= 0}
                            >
                              <Minus className="h-3 w-3 mr-1" />
                              <span>Sub</span>
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Chukoku</span>
                            <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                              {kumitePenalties.athlete2.chukoku}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1 border-yellow-500/30 text-yellow-500"
                              onClick={() => updateKumitePenalty('athlete2', 'chukoku', true)}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              <span>Add</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => updateKumitePenalty('athlete2', 'chukoku', false)}
                              disabled={kumitePenalties.athlete2.chukoku <= 0}
                            >
                              <Minus className="h-3 w-3 mr-1" />
                              <span>Sub</span>
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Keikoku</span>
                            <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                              {kumitePenalties.athlete2.keikoku}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1 border-yellow-500/30 text-yellow-500"
                              onClick={() => updateKumitePenalty('athlete2', 'keikoku', true)}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              <span>Add</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => updateKumitePenalty('athlete2', 'keikoku', false)}
                              disabled={kumitePenalties.athlete2.keikoku <= 0}
                            >
                              <Minus className="h-3 w-3 mr-1" />
                              <span>Sub</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Total */}
                    <div className="mt-6 pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total de pontos</span>
                        <div className="text-3xl font-bold">{kumiteScores.athlete2.total}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          {/* Kata Scoring Interface */}
          {isKataScoring && activeMatch && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Pontuação de Kata</h2>
                  <p className="text-muted-foreground">{activeMatch.category}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsKataScoring(false);
                      setActiveMatch(null);
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button onClick={() => setShowScoreKataDialog(true)}>
                    <Star className="h-4 w-4 mr-2" />
                    Pontuar Kata
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Athlete 1 */}
                <Card className="border-red-500/30">
                  <CardHeader className="bg-red-950/10">
                    <CardTitle className="flex items-center justify-between">
                      <span>{activeMatch.athlete1.name}</span>
                      <Badge className="bg-red-500/90">AKA</Badge>
                    </CardTitle>
                    <CardDescription>
                      Atleta AKA - Executando kata
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="text-center mb-6">
                        <p className="text-sm text-muted-foreground mb-2">Status</p>
                        <Badge className="px-4 py-1.5">Aguardando pontuação</Badge>
                      </div>
                      
                      {kataScores.total > 0 ? (
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-2">Pontuação Total</p>
                          <div className="text-5xl font-bold">{kataScores.total.toFixed(2)}</div>
                          <div className="flex items-center gap-4 mt-4">
                            <div className="text-center">
                              <div className="text-xs text-muted-foreground mb-1">Jurado 1</div>
                              <Badge variant="outline">{kataScores.judge1.toFixed(1)}</Badge>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-muted-foreground mb-1">Jurado 2</div>
                              <Badge variant="outline">{kataScores.judge2.toFixed(1)}</Badge>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-muted-foreground mb-1">Jurado 3</div>
                              <Badge variant="outline">{kataScores.judge3.toFixed(1)}</Badge>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Award className="h-12 w-12 text-muted-foreground mb-4" />
                          <p className="text-lg font-medium">Pontuação não registrada</p>
                          <p className="text-sm text-muted-foreground mt-2 max-w-xs text-center">
                            Clique no botão "Pontuar Kata" para registrar a pontuação dos jurados.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Athlete 2 */}
                <Card className="border-blue-500/30">
                  <CardHeader className="bg-blue-950/10">
                    <CardTitle className="flex items-center justify-between">
                      <span>{activeMatch.athlete2.name}</span>
                      <Badge className="bg-blue-500/90">AO</Badge>
                    </CardTitle>
                    <CardDescription>
                      Atleta AO - Aguardando
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="text-center">
                        <Award className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium">Atleta aguardando sua vez</p>
                        <p className="text-sm text-muted-foreground mt-2 max-w-xs text-center">
                          Este atleta aguarda sua vez para executar o kata.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          {/* Matches list */}
          {!isKumiteScoring && !isKataScoring && (
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="all">Todas Pontuações</TabsTrigger>
                <TabsTrigger value="kata">Kata</TabsTrigger>
                <TabsTrigger value="kumite">Kumite</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Resumo de Pontuações</CardTitle>
                      <CardDescription>Estatísticas gerais</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Total de avaliações</span>
                          <span className="font-medium">{MOCK_SCORING_DATA.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Maior pontuação</span>
                          <span className="font-medium">9.2</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Média geral</span>
                          <span className="font-medium">8.6</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="col-span-2">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Pontuações Recentes</CardTitle>
                          <CardDescription>Últimas pontuações registradas</CardDescription>
                        </div>
                        <Button variant="outline" size="sm">Ver todas</Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {MOCK_SCORING_DATA.slice(0, 3).map((score) => (
                          <div key={score.id} className="flex items-center justify-between border-b pb-3">
                            <div>
                              <p className="font-medium">{score.athlete}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline">{score.category}</Badge>
                                <span className="text-xs text-muted-foreground">{score.round}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                <span className="font-semibold text-primary">{score.score}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Todas as Pontuações</CardTitle>
                    <CardDescription>Lista completa de pontuações do torneio</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-md">
                      <div className="grid grid-cols-4 gap-4 p-4 font-medium bg-muted/50 border-b">
                        <div>Atleta</div>
                        <div>Categoria</div>
                        <div>Fase</div>
                        <div className="text-right">Pontuação</div>
                      </div>
                      
                      <div className="divide-y">
                        {MOCK_SCORING_DATA.map((score) => (
                          <div key={score.id} className="grid grid-cols-4 gap-4 p-4 items-center hover:bg-muted/20 transition-colors">
                            <div>{score.athlete}</div>
                            <div>{score.category}</div>
                            <div>{score.round}</div>
                            <div className="text-right">
                              <Badge className="bg-primary/90">{score.score}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="kata" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Pontuações de Kata</CardTitle>
                      <CardDescription>Competições de Kata deste torneio</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {MOCK_SCORING_DATA
                          .filter(score => score.category.includes("Kata"))
                          .map((score) => (
                            <div key={score.id} className="flex items-center justify-between border-b pb-3">
                              <div>
                                <p className="font-medium">{score.athlete}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline">{score.category}</Badge>
                                  <span className="text-xs text-muted-foreground">{score.round}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                  <span className="font-semibold text-primary">{score.score}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Lutas de Kata Programadas</CardTitle>
                      <CardDescription>Próximas lutas de Kata a serem pontuadas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {MOCK_MATCHES
                          .filter(match => match.type === "kata")
                          .map((match) => (
                            <div key={match.id} className="border rounded-md p-4">
                              <div className="flex justify-between items-center mb-3">
                                <Badge variant="outline">{match.category}</Badge>
                                <Button 
                                  size="sm" 
                                  onClick={() => startKataScoring(match)}
                                >
                                  Iniciar Pontuação
                                </Button>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full bg-red-500" />
                                  <span>{match.athlete1.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                                  <span>{match.athlete2.name}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="kumite" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Pontuações de Kumite</CardTitle>
                      <CardDescription>Competições de Kumite deste torneio</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {MOCK_SCORING_DATA
                          .filter(score => score.category.includes("Kumite"))
                          .map((score) => (
                            <div key={score.id} className="flex items-center justify-between border-b pb-3">
                              <div>
                                <p className="font-medium">{score.athlete}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline">{score.category}</Badge>
                                  <span className="text-xs text-muted-foreground">{score.round}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                  <span className="font-semibold text-primary">{score.score}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Lutas de Kumite Programadas</CardTitle>
                      <CardDescription>Próximas lutas de Kumite a serem pontuadas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {MOCK_MATCHES
                          .filter(match => match.type === "kumite")
                          .map((match) => (
                            <div key={match.id} className="border rounded-md p-4">
                              <div className="flex justify-between items-center mb-3">
                                <Badge variant="outline">{match.category}</Badge>
                                <Button 
                                  size="sm" 
                                  onClick={() => startKumiteScoring(match)}
                                >
                                  Iniciar Pontuação
                                </Button>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full bg-red-500" />
                                  <span>{match.athlete1.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                                  <span>{match.athlete2.name}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>
      
      {/* Dialog for creating new match */}
      <Dialog open={showCreateMatchDialog} onOpenChange={setShowCreateMatchDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Luta</DialogTitle>
            <DialogDescription>
              Preencha os detalhes para adicionar uma nova luta ao torneio.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Tipo de Luta</Label>
              <select
                id="type"
                name="type"
                className="flex h-10 w-full rounded-md border border-input bg-white/5 px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                value={newMatch.type}
                onChange={handleNewMatchChange}
              >
                <option value="kumite">Kumite</option>
                <option value="kata">Kata</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Categoria</Label>
              <select
                id="category"
                name="category"
                className="flex h-10 w-full rounded-md border border-input bg-white/5 px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                value={newMatch.category}
                onChange={handleNewMatchChange}
              >
                <option value="">Selecione uma categoria</option>
                {MOCK_CATEGORIES
                  .filter(cat => cat.type === newMatch.type)
                  .map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="athlete1">Atleta 1 (AKA)</Label>
              <select
                id="athlete1"
                name="athlete1"
                className="flex h-10 w-full rounded-md border border-input bg-white/5 px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                value={newMatch.athlete1}
                onChange={handleNewMatchChange}
              >
                <option value="">Selecione um atleta</option>
                {MOCK_ATHLETES.map(athlete => (
                  <option key={athlete.id} value={athlete.name}>
                    {athlete.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="athlete2">Atleta 2 (AO)</Label>
              <select
                id="athlete2"
                name="athlete2"
                className="flex h-10 w-full rounded-md border border-input bg-white/5 px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                value={newMatch.athlete2}
                onChange={handleNewMatchChange}
              >
                <option value="">Selecione um atleta</option>
                {MOCK_ATHLETES.map(athlete => (
                  <option key={athlete.id} value={athlete.name}>
                    {athlete.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateMatchDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={createNewMatch}>Adicionar Luta</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog for scoring kata */}
      <Dialog open={showScoreKataDialog} onOpenChange={setShowScoreKataDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Pontuação de Kata</DialogTitle>
            <DialogDescription>
              Insira as notas dos três jurados para o atleta {activeMatch?.athlete1.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="judge1">Jurado 1</Label>
                <Input 
                  id="judge1" 
                  type="number" 
                  min="0" 
                  max="10" 
                  step="0.1"
                  value={kataScores.judge1 || ''}
                  onChange={e => setKataScores(prev => ({
                    ...prev,
                    judge1: parseFloat(e.target.value) || 0
                  }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="judge2">Jurado 2</Label>
                <Input 
                  id="judge2" 
                  type="number" 
                  min="0" 
                  max="10" 
                  step="0.1"
                  value={kataScores.judge2 || ''}
                  onChange={e => setKataScores(prev => ({
                    ...prev,
                    judge2: parseFloat(e.target.value) || 0
                  }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="judge3">Jurado 3</Label>
                <Input 
                  id="judge3" 
                  type="number" 
                  min="0" 
                  max="10" 
                  step="0.1"
                  value={kataScores.judge3 || ''}
                  onChange={e => setKataScores(prev => ({
                    ...prev,
                    judge3: parseFloat(e.target.value) || 0
                  }))}
                />
              </div>
            </div>
            
            <div className="border rounded-md p-3 bg-muted/20 mt-2">
              <div className="text-sm text-muted-foreground mb-2">Média das Notas</div>
              <div className="text-2xl font-bold">
                {(
                  (kataScores.judge1 + kataScores.judge2 + kataScores.judge3) / 3
                ).toFixed(2)}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScoreKataDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={calculateKataScore}>Salvar Pontuação</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TournamentScoring;
