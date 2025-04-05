
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Activity,
  Trophy,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Swords,
  PenTool
} from "lucide-react";
import { ScoringPanel } from "@/components/ScoringPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Athlete {
  name: string;
  color: string;
}

interface Match {
  id: number;
  category: string;
  athlete1: Athlete;
  athlete2: Athlete;
  type: "kumite" | "kata";
}

const Scoring = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [matchStarted, setMatchStarted] = useState(false);
  const [matchPaused, setMatchPaused] = useState(false);
  const [time, setTime] = useState(120); // 2 minutes in seconds
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [activeTab, setActiveTab] = useState<"kumite" | "kata">("kumite");
  const [scores, setScores] = useState({
    athlete1: { yuko: 0, wazari: 0, ippon: 0 },
    athlete2: { yuko: 0, wazari: 0, ippon: 0 }
  });
  const [penalties, setPenalties] = useState({
    athlete1: { jogai: 0, chukoku: 0, keikoku: 0 },
    athlete2: { jogai: 0, chukoku: 0, keikoku: 0 }
  });
  const [fullscreenWindow, setFullscreenWindow] = useState<Window | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const kumiteMatches: Match[] = [
    {
      id: 1,
      category: "Kumite Masculino -75kg",
      athlete1: { name: "João Silva", color: "red" },
      athlete2: { name: "Carlos Eduardo", color: "blue" },
      type: "kumite"
    },
    {
      id: 3,
      category: "Kumite Masculino -67kg",
      athlete1: { name: "Pedro Santos", color: "red" },
      athlete2: { name: "Fernando Costa", color: "blue" },
      type: "kumite"
    },
  ];
  
  const kataMatches: Match[] = [
    {
      id: 2,
      category: "Kata Feminino",
      athlete1: { name: "Ana Pereira", color: "red" },
      athlete2: { name: "Lúcia Fernandes", color: "blue" },
      type: "kata"
    },
    {
      id: 4,
      category: "Kata Masculino",
      athlete1: { name: "Roberto Alves", color: "red" },
      athlete2: { name: "Ricardo Mendes", color: "blue" },
      type: "kata"
    },
  ];

  useEffect(() => {
    const matchId = searchParams.get('matchId');
    const matchType = searchParams.get('type') || "kumite";
    setActiveTab(matchType as "kumite" | "kata");
    
    if (matchId) {
      const matches = matchType === "kumite" ? kumiteMatches : kataMatches;
      const match = matches.find(m => m.id === Number(matchId));
      if (match) {
        setSelectedMatch(match);
        resetMatch();
        
        // Automatically open fullscreen scoring when a match is selected
        setTimeout(() => {
          openFullScreen();
        }, 500);
      }
    }
  }, [searchParams]);

  const updateScore = (athlete: 'athlete1' | 'athlete2', type: 'yuko' | 'wazari' | 'ippon', value: number) => {
    setScores(prev => ({
      ...prev,
      [athlete]: {
        ...prev[athlete],
        [type]: value
      }
    }));

    if (fullscreenWindow && !fullscreenWindow.closed && selectedMatch) {
      const updatedScores = {
        athlete1: {
          yuko: athlete === 'athlete1' && type === 'yuko' ? value : scores.athlete1.yuko,
          wazari: athlete === 'athlete1' && type === 'wazari' ? value : scores.athlete1.wazari,
          ippon: athlete === 'athlete1' && type === 'ippon' ? value : scores.athlete1.ippon,
          total: calculateTotal('athlete1', {
            ...scores.athlete1,
            [type]: athlete === 'athlete1' ? value : scores.athlete1[type]
          })
        },
        athlete2: {
          yuko: athlete === 'athlete2' && type === 'yuko' ? value : scores.athlete2.yuko,
          wazari: athlete === 'athlete2' && type === 'wazari' ? value : scores.athlete2.wazari,
          ippon: athlete === 'athlete2' && type === 'ippon' ? value : scores.athlete2.ippon,
          total: calculateTotal('athlete2', {
            ...scores.athlete2,
            [type]: athlete === 'athlete2' ? value : scores.athlete2[type]
          })
        }
      };

      console.log("Sending scores update to fullscreen:", updatedScores);
      fullscreenWindow.postMessage({
        type: 'UPDATE_SCORES',
        scores: updatedScores
      }, '*');
    }
  };
  
  const updatePenalty = (athlete: 'athlete1' | 'athlete2', type: 'jogai' | 'chukoku' | 'keikoku', value: number) => {
    setPenalties(prev => ({
      ...prev,
      [athlete]: {
        ...prev[athlete],
        [type]: value
      }
    }));

    if (fullscreenWindow && !fullscreenWindow.closed && selectedMatch) {
      fullscreenWindow.postMessage({
        type: 'UPDATE_PENALTIES',
        penalties: {
          ...penalties,
          [athlete]: {
            ...penalties[athlete],
            [type]: value
          }
        }
      }, '*');
    }
  };

  const handleSelectMatch = (match: Match) => {
    setSelectedMatch(match);
    resetMatch();
  };

  useEffect(() => {
    console.log("Timer effect running. Started:", matchStarted, "Paused:", matchPaused);
    
    if (matchStarted && !matchPaused) {
      console.log("Starting/resuming timer");
      timerRef.current = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            setMatchStarted(false);
            setMatchPaused(false);
            
            toast({
              title: "Tempo Finalizado",
              description: "O tempo da luta acabou!",
              variant: "default",
            });
            
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      console.log("Clearing timer");
      clearInterval(timerRef.current);
    }

    if (fullscreenWindow && !fullscreenWindow.closed && selectedMatch) {
      console.log("Sending timer update to fullscreen:", { time, matchStarted, matchPaused });
      fullscreenWindow.postMessage({
        type: 'UPDATE_TIME',
        time,
        matchStarted,
        matchPaused
      }, '*');
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [matchStarted, matchPaused, toast, fullscreenWindow, selectedMatch]);

  useEffect(() => {
    if (fullscreenWindow && !fullscreenWindow.closed && selectedMatch) {
      console.log("Sending timer update on time change:", { time, matchStarted, matchPaused });
      fullscreenWindow.postMessage({
        type: 'UPDATE_TIME',
        time,
        matchStarted,
        matchPaused
      }, '*');
    }
  }, [time, fullscreenWindow, selectedMatch, matchStarted, matchPaused]);

  useEffect(() => {
    return () => {
      if (fullscreenWindow && !fullscreenWindow.closed) {
        fullscreenWindow.close();
      }
    };
  }, [fullscreenWindow]);

  const startMatch = () => {
    console.log("Starting match");
    setMatchStarted(true);
    setMatchPaused(false);
  };

  const pauseMatch = () => {
    console.log("Pausing match");
    setMatchPaused(true);
  };

  const resumeMatch = () => {
    console.log("Resuming match");
    setMatchPaused(false);
  };

  const resetMatch = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    console.log("Resetting match");
    setMatchStarted(false);
    setMatchPaused(false);
    setTime(120);
    setScores({
      athlete1: { yuko: 0, wazari: 0, ippon: 0 },
      athlete2: { yuko: 0, wazari: 0, ippon: 0 }
    });
    setPenalties({
      athlete1: { jogai: 0, chukoku: 0, keikoku: 0 },
      athlete2: { jogai: 0, chukoku: 0, keikoku: 0 }
    });

    if (fullscreenWindow && !fullscreenWindow.closed && selectedMatch) {
      console.log("Sending reset to fullscreen");
      fullscreenWindow.postMessage({
        type: 'UPDATE_SCORES',
        scores: {
          athlete1: { yuko: 0, wazari: 0, ippon: 0, total: 0 },
          athlete2: { yuko: 0, wazari: 0, ippon: 0, total: 0 }
        }
      }, '*');
      
      fullscreenWindow.postMessage({
        type: 'UPDATE_TIME',
        time: 120,
        matchStarted: false,
        matchPaused: false
      }, '*');
      
      fullscreenWindow.postMessage({
        type: 'UPDATE_PENALTIES',
        penalties: {
          athlete1: { jogai: 0, chukoku: 0, keikoku: 0 },
          athlete2: { jogai: 0, chukoku: 0, keikoku: 0 }
        }
      }, '*');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const calculateTotal = (athlete: 'athlete1' | 'athlete2', scoreState = scores[athlete]) => {
    return scoreState.yuko + (scoreState.wazari * 2) + (scoreState.ippon * 4);
  };

  const openFullScreen = () => {
    if (!selectedMatch) return;
    
    if (fullscreenWindow && !fullscreenWindow.closed) {
      fullscreenWindow.focus();
      toast({
        title: "Tela já aberta",
        description: "A tela de pontuação já está aberta em outra janela",
        variant: "default",
      });
      return;
    }

    const url = `/scoring-fullscreen/${selectedMatch.id}?type=${selectedMatch.type}`;
    const windowName = `fullscreen-scoring-${selectedMatch.id}`;
    
    const win = window.open(url, windowName, 'fullscreen=yes,menubar=no,toolbar=no,location=no');
    
    if (win) {
      setFullscreenWindow(win);
      
      const checkClosed = setInterval(() => {
        if (win.closed) {
          clearInterval(checkClosed);
          setFullscreenWindow(null);
        }
      }, 1000);
      
      setTimeout(() => {
        if (!win.closed) {
          console.log("Initializing fullscreen with current state");
          
          fullscreenWindow.postMessage({
            type: 'UPDATE_SCORES',
            scores: {
              athlete1: { ...scores.athlete1, total: calculateTotal('athlete1') },
              athlete2: { ...scores.athlete2, total: calculateTotal('athlete2') }
            }
          }, '*');
          
          fullscreenWindow.postMessage({
            type: 'UPDATE_TIME',
            time,
            matchStarted,
            matchPaused
          }, '*');
          
          fullscreenWindow.postMessage({
            type: 'UPDATE_PENALTIES',
            penalties
          }, '*');
        }
      }, 1000);
      
      toast({
        title: "Tela de pontuação aberta",
        description: "A tela de pontuação foi aberta em uma nova janela",
        variant: "default",
      });
    } else {
      toast({
        title: "Erro ao abrir tela",
        description: "Não foi possível abrir a tela de pontuação. Verifique se o bloqueador de pop-ups está desativado.",
        variant: "destructive",
      });
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as "kumite" | "kata");
    setSelectedMatch(null);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 ml-64">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b bg-background/95 px-8 py-4 backdrop-blur">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Pontuação</h1>
            <p className="text-muted-foreground">Gerenciar pontuação das lutas</p>
          </div>

          <div className="flex items-center gap-3">
            {selectedMatch ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-medium">{selectedMatch.category}</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedMatch.athlete1.name} vs {selectedMatch.athlete2.name}
                  </div>
                </div>

                <div className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg font-mono text-lg w-20 
                  ${time <= 10 ? "bg-red-500/10 text-red-500" : "bg-muted"}
                  ${time === 0 ? "animate-pulse" : ""}
                `}>
                  <Timer className={`h-4 w-4 ${time <= 10 ? "text-red-500" : "text-muted-foreground"}`} />
                  <span>{formatTime(time)}</span>
                </div>

                <div className="flex items-center gap-1">
                  {!matchStarted ? (
                    <Button
                      onClick={startMatch}
                      size="icon"
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  ) : matchPaused ? (
                    <Button
                      onClick={resumeMatch}
                      size="icon"
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={pauseMatch}
                      size="icon"
                      variant="default"
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      <Pause className="h-4 w-4" />
                    </Button>
                  )}

                  <Button onClick={resetMatch} size="icon" variant="outline">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="outline" className="gap-2">
                <Trophy className="h-4 w-4" />
                <span>Selecione uma luta</span>
              </Button>
            )}
          </div>
        </header>

        <main className="p-6">
          <Tabs defaultValue="kumite" value={activeTab} onValueChange={handleTabChange} className="mb-6">
            <TabsList className="w-full md:w-auto grid grid-cols-2 h-auto p-1 bg-muted/50">
              <TabsTrigger 
                value="kumite" 
                className="flex items-center gap-2 py-3 px-5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Swords className="h-4 w-4" />
                <span>Kumite</span>
              </TabsTrigger>
              <TabsTrigger 
                value="kata" 
                className="flex items-center gap-2 py-3 px-5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <PenTool className="h-4 w-4" />
                <span>Kata</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="kumite" className="pt-4">
              {selectedMatch ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <ScoringPanel
                      match={selectedMatch}
                      isActive={matchStarted && !matchPaused}
                      scores={scores}
                      onUpdateScore={updateScore}
                      penalties={penalties}
                      onUpdatePenalty={updatePenalty}
                    />
                  </div>

                  <div className="space-y-6">
                    <div className="glass-card rounded-lg p-5">
                      <h2 className="text-lg font-semibold mb-4">Próximas Lutas</h2>

                      <div className="space-y-3">
                        {kumiteMatches
                          .filter((match) => match.id !== selectedMatch?.id)
                          .map((match) => (
                            <button
                              key={match.id}
                              onClick={() => handleSelectMatch(match)}
                              className="w-full p-3 rounded-md border border-border hover:border-primary hover:bg-primary/5 transition-colors text-left"
                            >
                              <p className="font-medium">{match.category}</p>
                              <p className="text-sm text-muted-foreground">
                                {match.athlete1.name} vs {match.athlete2.name}
                              </p>
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 border rounded-lg border-dashed">
                  <div className="mx-auto flex flex-col items-center">
                    <Trophy className="h-10 w-10 text-muted-foreground mb-3" />
                    <h3 className="text-lg font-medium mb-1">Selecione uma luta para pontuar</h3>
                    <p className="text-muted-foreground mb-4 max-w-md">
                      Escolha uma das lutas abaixo para começar a registrar pontuações.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                      {kumiteMatches.map((match) => (
                        <button
                          key={match.id}
                          onClick={() => handleSelectMatch(match)}
                          className="p-4 rounded-md border border-border hover:border-primary hover:bg-primary/5 transition-colors text-left"
                        >
                          <p className="font-medium">{match.category}</p>
                          <p className="text-sm text-muted-foreground">
                            {match.athlete1.name} vs {match.athlete2.name}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="kata" className="pt-4">
              {selectedMatch ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <ScoringPanel
                      match={selectedMatch}
                      isActive={matchStarted && !matchPaused}
                      scores={scores}
                      onUpdateScore={updateScore}
                      penalties={penalties}
                      onUpdatePenalty={updatePenalty}
                    />
                  </div>

                  <div className="space-y-6">
                    <div className="glass-card rounded-lg p-5">
                      <h2 className="text-lg font-semibold mb-4">Próximas Lutas</h2>

                      <div className="space-y-3">
                        {kataMatches
                          .filter((match) => match.id !== selectedMatch?.id)
                          .map((match) => (
                            <button
                              key={match.id}
                              onClick={() => handleSelectMatch(match)}
                              className="w-full p-3 rounded-md border border-border hover:border-primary hover:bg-primary/5 transition-colors text-left"
                            >
                              <p className="font-medium">{match.category}</p>
                              <p className="text-sm text-muted-foreground">
                                {match.athlete1.name} vs {match.athlete2.name}
                              </p>
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 border rounded-lg border-dashed">
                  <div className="mx-auto flex flex-col items-center">
                    <Trophy className="h-10 w-10 text-muted-foreground mb-3" />
                    <h3 className="text-lg font-medium mb-1">Selecione uma luta para pontuar</h3>
                    <p className="text-muted-foreground mb-4 max-w-md">
                      Escolha uma das lutas abaixo para começar a registrar pontuações.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                      {kataMatches.map((match) => (
                        <button
                          key={match.id}
                          onClick={() => handleSelectMatch(match)}
                          className="p-4 rounded-md border border-border hover:border-primary hover:bg-primary/5 transition-colors text-left"
                        >
                          <p className="font-medium">{match.category}</p>
                          <p className="text-sm text-muted-foreground">
                            {match.athlete1.name} vs {match.athlete2.name}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Scoring;
