
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TournamentSidebar } from "@/components/TournamentSidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Swords, Award, PenTool } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MatchCard } from "@/components/MatchCard";

const TournamentScoring = () => {
  const { id: tournamentId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("kumite");
  const [activeFullScreenWindows, setActiveFullScreenWindows] = useState<Record<string, Window | null>>({});
  const { toast } = useToast();
  
  // Referência para o estado atual dos pontos de cada luta
  const matchScoresRef = useRef<Record<number, {
    athlete1: { yuko: number, wazari: number, ippon: number, total: number },
    athlete2: { yuko: number, wazari: number, ippon: number, total: number }
  }>>({});

  // Referência para o estado atual dos timers de cada luta
  const matchTimersRef = useRef<Record<number, {
    time: number,
    matchStarted: boolean,
    matchPaused: boolean
  }>>({});

  // Referência para o estado atual das penalidades de cada luta
  const matchPenaltiesRef = useRef<Record<number, {
    athlete1: { jogai: number, chukoku: number, keikoku: number },
    athlete2: { jogai: number, chukoku: number, keikoku: number }
  }>>({});
  
  // Manipular mensagens da janela de tela cheia
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log("Received message in tournament scoring:", event.data);
      
      if (event.data.type === 'REQUEST_STATE') {
        const { matchId } = event.data;
        const matchIdNum = Number(matchId);
        console.log("Fullscreen requested state for match:", matchIdNum);
        
        // Verificar se temos estado para este match
        if (matchScoresRef.current[matchIdNum]) {
          // Enviar pontuação atual
          console.log("Sending scores to fullscreen:", matchScoresRef.current[matchIdNum]);
          event.source?.postMessage({
            type: 'UPDATE_SCORES',
            scores: matchScoresRef.current[matchIdNum]
          }, { targetOrigin: '*' } as WindowPostMessageOptions);
          
          // Enviar tempo atual
          if (matchTimersRef.current[matchIdNum]) {
            console.log("Sending timer to fullscreen:", matchTimersRef.current[matchIdNum]);
            event.source?.postMessage({
              type: 'UPDATE_TIME',
              time: matchTimersRef.current[matchIdNum].time,
              matchStarted: matchTimersRef.current[matchIdNum].matchStarted,
              matchPaused: matchTimersRef.current[matchIdNum].matchPaused
            }, { targetOrigin: '*' } as WindowPostMessageOptions);
          }
          
          // Enviar penalidades
          if (matchPenaltiesRef.current[matchIdNum]) {
            console.log("Sending penalties to fullscreen:", matchPenaltiesRef.current[matchIdNum]);
            event.source?.postMessage({
              type: 'UPDATE_PENALTIES',
              penalties: matchPenaltiesRef.current[matchIdNum]
            }, { targetOrigin: '*' } as WindowPostMessageOptions);
          }
        } else {
          console.log("No state found for match:", matchIdNum);
          // Inicializar estado para este match
          initializeMatchState(matchIdNum);
          
          // Enviar estado inicial
          event.source?.postMessage({
            type: 'UPDATE_SCORES',
            scores: matchScoresRef.current[matchIdNum]
          }, { targetOrigin: '*' } as WindowPostMessageOptions);
          
          event.source?.postMessage({
            type: 'UPDATE_TIME',
            time: matchTimersRef.current[matchIdNum].time,
            matchStarted: matchTimersRef.current[matchIdNum].matchStarted,
            matchPaused: matchTimersRef.current[matchIdNum].matchPaused
          }, { targetOrigin: '*' } as WindowPostMessageOptions);
          
          event.source?.postMessage({
            type: 'UPDATE_PENALTIES',
            penalties: matchPenaltiesRef.current[matchIdNum]
          }, { targetOrigin: '*' } as WindowPostMessageOptions);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    console.log("Message event listener added in tournament scoring");
    
    return () => {
      window.removeEventListener('message', handleMessage);
      console.log("Message event listener removed in tournament scoring");
      
      // Fechar todas as janelas ao desmontar
      Object.values(activeFullScreenWindows).forEach(win => {
        if (win && !win.closed) {
          win.close();
        }
      });
    };
  }, [activeFullScreenWindows]);
  
  // Inicializar estado de pontuação para uma luta (quando necessário)
  const initializeMatchState = (matchId: number) => {
    console.log("Initializing state for match:", matchId);
    
    if (!matchScoresRef.current[matchId]) {
      matchScoresRef.current[matchId] = {
        athlete1: { yuko: 0, wazari: 0, ippon: 0, total: 0 },
        athlete2: { yuko: 0, wazari: 0, ippon: 0, total: 0 }
      };
    }
    
    if (!matchTimersRef.current[matchId]) {
      matchTimersRef.current[matchId] = {
        time: 120,
        matchStarted: false,
        matchPaused: false
      };
    }
    
    if (!matchPenaltiesRef.current[matchId]) {
      matchPenaltiesRef.current[matchId] = {
        athlete1: { jogai: 0, chukoku: 0, keikoku: 0 },
        athlete2: { jogai: 0, chukoku: 0, keikoku: 0 }
      };
    }
  };
  
  // Função para atualizar pontos e notificar tela cheia
  const updateMatchScore = (matchId: number, athlete: 'athlete1' | 'athlete2', type: 'yuko' | 'wazari' | 'ippon', value: number) => {
    // Garantir que o estado existe
    initializeMatchState(matchId);
    
    console.log("Updating score for match:", matchId, "athlete:", athlete, "type:", type, "value:", value);
    
    // Atualizar pontuação
    matchScoresRef.current[matchId][athlete][type] = value;
    
    // Recalcular total
    matchScoresRef.current[matchId][athlete].total = 
      matchScoresRef.current[matchId][athlete].yuko + 
      (matchScoresRef.current[matchId][athlete].wazari * 2) + 
      (matchScoresRef.current[matchId][athlete].ippon * 4);
    
    // Enviar atualização para tela cheia
    const fullScreenWindowKey = `${matchId}-window`;
    const fullScreenWindow = activeFullScreenWindows[fullScreenWindowKey];
    
    if (fullScreenWindow && !fullScreenWindow.closed) {
      console.log("Sending score update to fullscreen:", matchScoresRef.current[matchId]);
      fullScreenWindow.postMessage({
        type: 'UPDATE_SCORES',
        scores: matchScoresRef.current[matchId]
      }, '*');
    }
  };
  
  // Função para atualizar timer e notificar tela cheia
  const updateMatchTimer = (matchId: number, time: number, matchStarted: boolean, matchPaused: boolean) => {
    // Garantir que o estado existe
    initializeMatchState(matchId);
    
    console.log("Updating timer for match:", matchId, "time:", time, "started:", matchStarted, "paused:", matchPaused);
    
    // Atualizar timer
    matchTimersRef.current[matchId] = {
      time,
      matchStarted,
      matchPaused
    };
    
    // Enviar atualização para todas as telas cheias deste match
    const fullScreenWindowKey = `${matchId}-window`;
    const fullScreenWindow = activeFullScreenWindows[fullScreenWindowKey];
    
    if (fullScreenWindow && !fullScreenWindow.closed) {
      console.log("Sending timer update to fullscreen");
      fullScreenWindow.postMessage({
        type: 'UPDATE_TIME',
        time,
        matchStarted,
        matchPaused
      }, '*');
    }
  };

  // Função para atualizar penalidades e notificar tela cheia
  const updateMatchPenalties = (matchId: number, athlete: 'athlete1' | 'athlete2', type: 'jogai' | 'chukoku' | 'keikoku', value: number) => {
    // Garantir que o estado existe
    initializeMatchState(matchId);
    
    console.log("Updating penalties for match:", matchId, "athlete:", athlete, "type:", type, "value:", value);
    
    // Atualizar penalidades
    matchPenaltiesRef.current[matchId][athlete][type] = value;
    
    // Enviar atualização para tela cheia
    const fullScreenWindowKey = `${matchId}-window`;
    const fullScreenWindow = activeFullScreenWindows[fullScreenWindowKey];
    
    if (fullScreenWindow && !fullScreenWindow.closed) {
      console.log("Sending penalties update to fullscreen");
      fullScreenWindow.postMessage({
        type: 'UPDATE_PENALTIES',
        penalties: matchPenaltiesRef.current[matchId]
      }, '*');
    }
  };
  
  // Dados fictícios para demonstração
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
  
  const openFullScreenScoring = (matchId: number, matchType: string) => {
    const url = `/scoring-fullscreen/${matchId}?type=${matchType}`;
    const windowName = `fullscreen-scoring-${matchId}`;
    const windowKey = `${matchId}-window`;
    
    // Verificar se já existe uma janela aberta para este match
    if (activeFullScreenWindows[windowKey] && !activeFullScreenWindows[windowKey]?.closed) {
      activeFullScreenWindows[windowKey]?.focus();
      toast({
        title: "Tela já aberta",
        description: "A tela de pontuação já está aberta em outra janela",
        variant: "default",
      });
      return;
    }
    
    console.log("Opening fullscreen window for match:", matchId, "type:", matchType);
    
    // Abrir nova janela
    const win = window.open(url, windowName, 'fullscreen=yes,menubar=no,toolbar=no,location=no');
    
    if (win) {
      // Armazenar referência à janela
      setActiveFullScreenWindows(prev => ({
        ...prev,
        [windowKey]: win
      }));
      
      // Inicializar estado
      initializeMatchState(matchId);
      
      // Verificar quando a janela for fechada
      const checkClosed = setInterval(() => {
        if (win.closed) {
          clearInterval(checkClosed);
          setActiveFullScreenWindows(prev => {
            const updated = { ...prev };
            delete updated[windowKey];
            return updated;
          });
          console.log("Fullscreen window closed for match:", matchId);
        }
      }, 1000);
      
      // Inicializar a tela cheia com os dados atuais após um breve atraso
      setTimeout(() => {
        if (!win.closed) {
          console.log("Initializing fullscreen with data for match:", matchId);
          win.postMessage({
            type: 'UPDATE_SCORES',
            scores: matchScoresRef.current[matchId]
          }, '*');
          
          win.postMessage({
            type: 'UPDATE_TIME',
            time: matchTimersRef.current[matchId].time,
            matchStarted: matchTimersRef.current[matchId].matchStarted,
            matchPaused: matchTimersRef.current[matchId].matchPaused
          }, '*');
          
          win.postMessage({
            type: 'UPDATE_PENALTIES',
            penalties: matchPenaltiesRef.current[matchId]
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

  const handleScoreMatch = (matchId: number) => {
    // Abre a tela de pontuação em tela cheia diretamente
    openFullScreenScoring(matchId, activeTab);
    
    // Apenas navegue para a tela de pontuação sem abrir em tela cheia
    // Isso foi comentado para resolver o problema de 404
    // navigate(`/scoring?matchId=${matchId}`);
  };
  
  return (
    <div className="flex min-h-screen bg-background">
      <TournamentSidebar />
      
      <div className="flex-1 ml-64">
        <header className="sticky top-0 z-40 border-b bg-background/95 px-8 py-4 backdrop-blur">
          <h1 className="text-2xl font-semibold tracking-tight">Pontuação</h1>
          <p className="text-muted-foreground">
            Sistema de pontuação para este torneio
          </p>
        </header>
        
        <main className="px-8 py-6">
          <Tabs defaultValue="kumite" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <TabsList className="h-12 p-1 bg-background border">
                <TabsTrigger 
                  value="kumite" 
                  className="flex items-center gap-2 py-2.5 px-8 data-[state=active]:bg-red-500 data-[state=active]:text-white rounded-none"
                >
                  <Swords className="h-4 w-4" />
                  <span>Kumite</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="kata" 
                  className="flex items-center gap-2 py-2.5 px-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none"
                >
                  <PenTool className="h-4 w-4" />
                  <span>Kata</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="kumite" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kumiteMatches.map((match) => (
                  <MatchCard 
                    key={match.id} 
                    category={match.category}
                    time="14:30"
                    mat="Tatame 1"
                    player1={match.athlete1.name}
                    player2={match.athlete2.name}
                    onScore={() => handleScoreMatch(match.id)}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="kata" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kataMatches.map((match) => (
                  <MatchCard 
                    key={match.id} 
                    category={match.category}
                    time="15:45"
                    mat="Tatame 2"
                    player1={match.athlete1.name}
                    player2={match.athlete2.name}
                    onScore={() => handleScoreMatch(match.id)}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default TournamentScoring;
