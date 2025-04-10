import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TournamentSidebar } from "@/components/TournamentSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Trophy, Timer, User, Calendar, Shield, ArrowRight, 
  Flag, Star, Plus, Minus, X, ArrowLeft, Play, Pause, RefreshCcw, Clock, Circle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

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

const ScoreButton = ({ 
  label, 
  value, 
  onIncrement, 
  onDecrement 
}: { 
  label: string; 
  value: number; 
  onIncrement: () => void; 
  onDecrement: () => void;
}) => {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <div className="flex items-center justify-between bg-muted/30 rounded-md p-1.5">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-6 w-6" 
          onClick={onDecrement}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="font-semibold text-sm">{value}</span>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-6 w-6" 
          onClick={onIncrement}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

const PenaltyButton = ({ 
  label, 
  value, 
  color,
  onIncrement, 
  onDecrement,
  className = ""
}: { 
  label: string; 
  value: number; 
  color: "yellow" | "orange" | "red";
  onIncrement: () => void; 
  onDecrement: () => void;
  className?: string;
}) => {
  const colorClasses = {
    yellow: "bg-yellow-500/10 border-yellow-500/30 text-yellow-700 dark:text-yellow-400",
    orange: "bg-orange-500/10 border-orange-500/30 text-orange-700 dark:text-orange-400",
    red: "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400"
  };

  return (
    <div className={`${className} relative rounded-md p-2 border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium">{label}</span>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-6 w-6 bg-background" 
            onClick={onDecrement}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="font-semibold text-sm w-5 text-center">{value}</span>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-6 w-6 bg-background" 
            onClick={onIncrement}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const TournamentScoring = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("kata");
  const [scoringMode, setScoringMode] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<MatchData | null>(null);
  const [kataScore, setKataScore] = useState<KataScore>({
    judge1: 0,
    judge2: 0,
    judge3: 0,
  });
  const [kumiteScore, setKumiteScore] = useState<KumiteScore>({
    athlete1: { 
      yuko: 0,
      wazari: 0, 
      ippon: 0, 
      penalties: 0,
      jogai: 0,
      mubobi: 0,
      chukoku: 0,
      keikoku: 0,
      hansokuChui: 0,
      hansoku: 0,
      shikkaku: 0
    },
    athlete2: { 
      yuko: 0,
      wazari: 0, 
      ippon: 0, 
      penalties: 0,
      jogai: 0,
      mubobi: 0,
      chukoku: 0,
      keikoku: 0,
      hansokuChui: 0,
      hansoku: 0,
      shikkaku: 0
    },
  });

  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const kataMatches: MatchData[] = [
    { id: 4, type: "kata", athlete1: "Juliana Costa", athlete2: null, category: "Adulto Feminino", time: "16:00" },
    { id: 5, type: "kata", athlete1: "Ricardo Alves", athlete2: null, category: "Adulto Masculino", time: "16:15" },
    { id: 8, type: "kata", athlete1: "Ana Pereira", athlete2: null, category: "Juvenil Feminino", time: "17:20" }
  ];
  
  const kumiteMatches: MatchData[] = [
    { id: 6, type: "kumite", athlete1: "Marcos Paulo", athlete2: "Gabriel Souza", category: "Adulto Masculino -84kg", time: "16:30" },
    { id: 7, type: "kumite", athlete1: "Camila Ferreira", athlete2: "Patrícia Ramos", category: "Adulto Feminino -61kg", time: "16:45" },
    { id: 9, type: "kumite", athlete1: "Thiago Martins", athlete2: "Lucas Almeida", category: "Juvenil Masculino -70kg", time: "17:00" }
  ];

  const handleStartMatch = (match: MatchData) => {
    setCurrentMatch(match);
    if (match.type === "kata") {
      setKataScore({ judge1: 0, judge2: 0, judge3: 0 });
    } else {
      setKumiteScore({
        athlete1: { 
          yuko: 0,
          wazari: 0, 
          ippon: 0, 
          penalties: 0,
          jogai: 0,
          mubobi: 0,
          chukoku: 0,
          keikoku: 0,
          hansokuChui: 0,
          hansoku: 0,
          shikkaku: 0
        },
        athlete2: { 
          yuko: 0,
          wazari: 0, 
          ippon: 0, 
          penalties: 0,
          jogai: 0,
          mubobi: 0,
          chukoku: 0,
          keikoku: 0,
          hansokuChui: 0,
          hansoku: 0,
          shikkaku: 0
        },
      });
    }
    setTimeLeft(180);
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setScoringMode(true);
  };

  const startTimer = () => {
    if (isRunning) return;
    
    setIsRunning(true);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    if (!isRunning) return;
    
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetTimer = () => {
    pauseTimer();
    setTimeLeft(180);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleKataScoreChange = (judge: 'judge1' | 'judge2' | 'judge3', value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0 || numValue > 10) {
      return;
    }
    setKataScore(prev => ({ ...prev, [judge]: numValue }));
  };

  const calculateKataTotal = (): number => {
    return kataScore.judge1 + kataScore.judge2 + kataScore.judge3;
  };

  const handleKumiteScoreChange = (
    athlete: 'athlete1' | 'athlete2',
    scoreType: keyof KumiteScore['athlete1'],
    change: number
  ) => {
    setKumiteScore(prev => {
      const newValue = Math.max(0, prev[athlete][scoreType] + change);
      
      return {
        ...prev,
        [athlete]: {
          ...prev[athlete],
          [scoreType]: newValue
        }
      };
    });
  };

  const handleSaveScore = () => {
    if (!currentMatch) return;
    
    if (currentMatch.type === "kata") {
      toast.success(`Pontuação de Kata salva: ${calculateKataTotal().toFixed(1)} pontos`);
    } else {
      toast.success("Pontuação de Kumite salva com sucesso");
    }
    
    setScoringMode(false);
  };

  const handleBackToMatches = () => {
    pauseTimer();
    setScoringMode(false);
  };

  const determineWinner = (): string | null => {
    if (!currentMatch || currentMatch.type !== "kumite") return null;
    
    const athlete1 = kumiteScore.athlete1;
    const athlete2 = kumiteScore.athlete2;
    
    if (athlete1.hansoku > 0 || athlete1.shikkaku > 0) return currentMatch.athlete2;
    if (athlete2.hansoku > 0 || athlete2.shikkaku > 0) return currentMatch.athlete1;
    
    const athlete1Score = athlete1.yuko + (athlete1.wazari * 2) + (athlete1.ippon * 3) - athlete1.penalties;
    const athlete2Score = athlete2.yuko + (athlete2.wazari * 2) + (athlete2.ippon * 3) - athlete2.penalties;
    
    if (athlete1Score > athlete2Score) return currentMatch.athlete1;
    if (athlete2Score > athlete1Score) return currentMatch.athlete2;
    
    return null;
  };

  if (scoringMode && currentMatch) {
    return (
      <div className="flex h-screen bg-background overflow-hidden">
        <TournamentSidebar />
        
        <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
          <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleBackToMatches}
                  className="h-9 w-9 hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    {currentMatch.type === "kata" ? 
                      "Pontuação de Kata" : 
                      "Pontuação de Kumite"
                    }
                  </h1>
                  <p className="text-sm text-muted-foreground">{currentMatch.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-3 py-1.5 flex gap-1.5 items-center">
                  <Timer className="h-3.5 w-3.5 text-primary" />
                  <span>{currentMatch.time}</span>
                </Badge>
              </div>
            </div>
          </header>
          
          <main className="flex-1 overflow-hidden">
            <div className="w-[90%] mx-auto h-full flex flex-col py-4">
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-4 rounded-xl shadow-sm border border-border/30 mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Timer className="h-5 w-5 text-primary" />
                    Tempo
                  </h3>
                  <div className="flex space-x-2">
                    <Button 
                      variant={isRunning ? "outline" : "default"} 
                      size="sm" 
                      onClick={startTimer} 
                      disabled={isRunning}
                      className={`h-9 w-9 p-0 ${!isRunning ? "bg-green-500 hover:bg-green-600" : ""}`}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={!isRunning ? "outline" : "default"} 
                      size="sm" 
                      onClick={pauseTimer} 
                      disabled={!isRunning}
                      className={`h-9 w-9 p-0 ${isRunning ? "bg-amber-500 hover:bg-amber-600" : ""}`}
                    >
                      <Pause className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={resetTimer}
                      className="h-9 w-9 p-0 hover:bg-primary/10"
                    >
                      <RefreshCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-2 flex justify-center">
                  <div className={`text-4xl font-bold px-6 py-2 rounded-lg ${
                    timeLeft <= 10 
                      ? "text-red-500 animate-pulse bg-red-500/10" 
                      : isRunning 
                        ? "text-green-500 bg-green-500/10" 
                        : "bg-muted/30"
                  }`}>
                    {formatTime(timeLeft)}
                  </div>
                </div>
              </div>

              {currentMatch.type === "kata" ? (
                <div className="grid grid-cols-1 h-[calc(100%-120px)]">
                  <div className="bg-card shadow-md rounded-xl overflow-hidden border border-border/40 flex flex-col h-full">
                    <div className="bg-gradient-to-r from-primary/10 to-transparent p-4 border-b border-border/30">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                          <User className="h-7 w-7 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">{currentMatch.athlete1}</h3>
                          <p className="text-sm text-muted-foreground">{currentMatch.category}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 flex-grow flex-col">
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        {(['judge1', 'judge2', 'judge3'] as const).map((judge, index) => (
                          <div key={judge} className="space-y-2">
                            <Label htmlFor={judge} className="flex justify-between text-base">
                              <span className="flex items-center gap-1.5">
                                <Star className="h-4 w-4 text-primary" />
                                Jurado {index + 1}
                              </span>
                              <span className="text-muted-foreground text-sm">
                                0-10
                              </span>
                            </Label>
                            <Input
                              id={judge}
                              type="number"
                              min="0"
                              max="10"
                              step="0.1"
                              value={kataScore[judge]}
                              onChange={(e) => handleKataScoreChange(judge, e.target.value)}
                              className="text-center text-xl font-semibold h-14 bg-muted/20 border-primary/20 focus-visible:ring-primary/30"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="mt-auto pt-4 border-t border-border/30">
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-medium">Pontuação Total:</span>
                          <div className="bg-gradient-to-r from-primary/20 to-primary/10 px-6 py-3 rounded-lg">
                            <span className="text-3xl font-bold text-primary">
                              {calculateKataTotal().toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button 
                      onClick={handleSaveScore}
                      className="gap-2 bg-primary hover:bg-primary/90 px-6 py-2 text-base shadow-md rounded-lg"
                    >
                      <Trophy className="h-5 w-5" />
                      Salvar Pontuação
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-[calc(100%-120px)]">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gradient-to-r from-primary/10 to-transparent rounded-xl p-3 text-center shadow-sm border border-border/30">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg text-left">{currentMatch.athlete1}</h3>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-primary/10 to-transparent rounded-xl p-3 text-center shadow-sm border border-border/30">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg text-left">{currentMatch.athlete2}</h3>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 flex-grow overflow-hidden">
                    <div className="border border-border/30 rounded-xl overflow-hidden shadow-sm bg-card flex flex-col">
                      <div className="bg-gradient-to-r from-primary/10 to-transparent p-2 border-b border-border/30">
                        <h3 className="font-semibold text-sm text-center">Pontuação - {currentMatch.athlete1}</h3>
                      </div>
                      
                      <div className="p-2 overflow-auto flex-grow">
                        <div className="grid grid-cols-1 gap-3 h-full">
                          <div className="space-y-2">
                            <h4 className="font-medium text-xs uppercase text-muted-foreground flex items-center gap-1">
                              <Trophy className="h-3 w-3 text-primary" />
                              Pontos
                            </h4>
                            
                            <div className="grid grid-cols-3 gap-2">
                              <ScoreButton 
                                label="Yuko (1pt)" 
                                value={kumiteScore.athlete1.yuko}
                                onIncrement={() => handleKumiteScoreChange('athlete1', 'yuko', 1)}
                                onDecrement={() => handleKumiteScoreChange('athlete1', 'yuko', -1)}
                              />
                              
                              <ScoreButton 
                                label="Waza-ari (2pts)" 
                                value={kumiteScore.athlete1.wazari}
                                onIncrement={() => handleKumiteScoreChange('athlete1', 'wazari', 1)}
                                onDecrement={() => handleKumiteScoreChange('athlete1', 'wazari', -1)}
                              />
                              
                              <ScoreButton 
                                label="Ippon (3pts)" 
                                value={kumiteScore.athlete1.ippon}
                                onIncrement={() => handleKumiteScoreChange('athlete1', 'ippon', 1)}
                                onDecrement={() => handleKumiteScoreChange('athlete1', 'ippon', -1)}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-medium text-xs uppercase text-muted-foreground flex items-center gap-1">
                              <Flag className="h-3 w-3 text-red-500" />
                              Penalidades
                            </h4>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <PenaltyButton 
                                label="Chukoku" 
                                value={kumiteScore.athlete1.chukoku}
                                color="yellow"
                                onIncrement={() => handleKumiteScoreChange('athlete1', 'chukoku', 1)}
                                onDecrement={() => handleKumiteScoreChange('athlete1', 'chukoku', -1)}
                              />
                              
                              <PenaltyButton 
                                label="Keikoku" 
                                value={kumiteScore.athlete1.keikoku}
                                color="yellow"
                                onIncrement={() => handleKumiteScoreChange('athlete1', 'keikoku', 1)}
                                onDecrement={() => handleKumiteScoreChange('athlete1', 'keikoku', -1)}
                              />
                              
                              <PenaltyButton 
                                label="Jogai" 
                                value={kumiteScore.athlete1.jogai}
                                color="yellow"
                                onIncrement={() => handleKumiteScoreChange('athlete1', 'jogai', 1)}
                                onDecrement={() => handleKumiteScoreChange('athlete1', 'jogai', -1)}
                              />
                              
                              <PenaltyButton 
                                label="Mubobi" 
                                value={kumiteScore.athlete1.mubobi}
                                color="yellow"
                                onIncrement={() => handleKumiteScoreChange('athlete1', 'mubobi', 1)}
                                onDecrement={() => handleKumiteScoreChange('athlete1', 'mubobi', -1)}
                              />
                              
                              <PenaltyButton 
                                label="Hansoku-Chui" 
                                value={kumiteScore.athlete1.hansokuChui}
                                color="orange"
                                onIncrement={() => handleKumiteScoreChange('athlete1', 'hansokuChui', 1)}
                                onDecrement={() => handleKumiteScoreChange('athlete1', 'hansokuChui', -1)}
                              />
                              
                              <PenaltyButton 
                                label="Hansoku" 
                                value={kumiteScore.athlete1.hansoku}
                                color="red"
                                onIncrement={() => handleKumiteScoreChange('athlete1', 'hansoku', 1)}
                                onDecrement={() => handleKumiteScoreChange('athlete1', 'hansoku', -1)}
                              />
                              
                              <PenaltyButton 
                                label="Shikkaku" 
                                value={kumiteScore.athlete1.shikkaku}
                                color="red"
                                onIncrement={() => handleKumiteScoreChange('athlete1', 'shikkaku', 1)}
                                onDecrement={() => handleKumiteScoreChange('athlete1', 'shikkaku', -1)}
                                className="col-span-2"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border border-border/30 rounded-xl overflow-hidden shadow-sm bg-card flex flex-col">
                      <div className="bg-gradient-to-r from-primary/10 to-transparent p-2 border-b border-border/30">
                        <h3 className="font-semibold text-sm text-center">Pontuação - {currentMatch.athlete2}</h3>
                      </div>
                      
                      <div className="p-2 overflow-auto flex-grow">
                        <div className="grid grid-cols-1 gap-3 h-full">
                          <div className="space-y-2">
                            <h4 className="font-medium text-xs uppercase text-muted-foreground flex items-center gap-1">
                              <Trophy className="h-3 w-3 text-primary" />
                              Pontos
                            </h4>
                            
                            <div className="grid grid-cols-3 gap-2">
                              <ScoreButton 
                                label="Yuko (1pt)" 
                                value={kumiteScore.athlete2.yuko}
                                onIncrement={() => handleKumiteScoreChange('athlete2', 'yuko', 1)}
                                onDecrement={() => handleKumiteScoreChange('athlete2', 'yuko', -1)}
                              />
                              
                              <ScoreButton 
                                label="Waza-ari (2pts)" 
                                value={kumiteScore.athlete2.wazari}
                                onIncrement={() => handleKumiteScoreChange('athlete2', 'wazari', 1)}
                                onDecrement={() => handleKumiteScoreChange('athlete2', 'wazari', -1)}
                              />
                              
                              <ScoreButton 
                                label="Ippon (3pts)" 
                                value={kumiteScore.athlete2.ippon}
                                onIncrement={() => handleKumiteScoreChange('athlete2', 'ippon', 1)}
                                onDecrement={() => handleKumiteScoreChange('athlete2', 'ippon', -1)}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-medium text-xs uppercase text-muted-foreground flex items-center gap-1">
                              <Flag className="h-3 w-3 text-red-500" />
                              Penalidades
                            </h4>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <PenaltyButton 
                                label="Chukoku" 
                                value={kumiteScore.athlete2.chukoku}
                                color="yellow"
                                onIncrement={() => handleKumiteScoreChange('athlete2', 'chukoku', 1)}
                                onDecrement={() => handleKumiteScoreChange('athlete2', 'chukoku', -1)}
                              />
                              
                              <PenaltyButton 
                                label="Keikoku" 
                                value={kumiteScore.athlete2.keikoku}
                                color="yellow"
                                onIncrement={() => handleKumiteScoreChange('athlete2', 'keikoku', 1)}
                                onDecrement={() => handleKumiteScoreChange('athlete2', 'keikoku', -1)}
                              />
                              
                              <PenaltyButton 
                                label="Jogai" 
                                value={kumiteScore.athlete2.jogai}
                                color="yellow"
                                onIncrement={() => handleKumiteScoreChange('athlete2', 'jogai', 1)}
                                onDecrement={() => handleKumiteScoreChange('athlete2', 'jogai', -1)}
                              />
                              
                              <PenaltyButton 
                                label="Mubobi" 
                                value={kumiteScore.athlete2.mubobi}
                                color="yellow"
                                onIncrement={() => handleKumiteScoreChange('athlete2', 'mubobi', 1)}
                                onDecrement={() => handleKumiteScoreChange('athlete2', 'mubobi', -1)}
                              />
                              
                              <PenaltyButton 
                                label="Hansoku-Chui" 
                                value={kumiteScore.athlete2.hansokuChui}
                                color="orange"
                                onIncrement={() => handleKumiteScoreChange('athlete2', 'hansokuChui', 1)}
                                onDecrement={() => handleKumiteScoreChange('athlete2', 'hansokuChui', -1)}
                              />
                              
                              <PenaltyButton 
                                label="Hansoku" 
                                value={kumiteScore.athlete2.hansoku}
                                color="red"
                                onIncrement={() => handleKumiteScoreChange('athlete2', 'hansoku', 1)}
                                onDecrement={() => handleKumiteScoreChange('athlete2', 'hansoku', -1)}
                              />
                              
                              <PenaltyButton 
                                label="Shikkaku" 
                                value={kumiteScore.athlete2.shikkaku}
                                color="red"
                                onIncrement={() => handleKumiteScoreChange('athlete2', 'shikkaku', 1)}
                                onDecrement={() => handleKumiteScoreChange('athlete2', 'shikkaku', -1)}
                                className="col-span-2"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4">
                    <div className="p-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl shadow-sm border border-border/30">
                      <div className="flex justify-between items-center">
                        <span className="text-base font-medium flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-primary" />
                          Vencedor:
                        </span>
                        <div className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
                          {determineWinner() ? (
                            <span className="font-bold text-base text-primary">{determineWinner()}</span>
                          ) : (
                            <span className="text-muted-foreground text-sm">Aguardando...</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleSaveScore}
                        className="gap-2 bg-primary hover:bg-primary/90 px-6 py-2 text-base shadow-md rounded-lg"
                      >
                        <Trophy className="h-5 w-5" />
                        Salvar Pontuação
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-[#222222] overflow-hidden">
      <TournamentSidebar />
      
      <div className="flex-1 ml-64 flex flex-col h-screen">
        <header className="border-b border-zinc-800 bg-[#1A1F2C]/95 backdrop-blur-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Pontua��ão do Torneio</h1>
              <p className="text-sm text-zinc-400">Gerencie pontuações de katas e kumites</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-3 py-1.5 flex gap-1.5 items-center border-zinc-700 bg-zinc-800/50">
                <Trophy className="h-3.5 w-3.5 text-red-500" />
                <span className="text-zinc-300">Torneio #{id}</span>
              </Badge>
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-6 overflow-auto bg-[#222222]">
          <div className="w-full max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                  <Calendar className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Próximas Lutas</h2>
                  <p className="text-sm text-zinc-400">Selecione uma luta para iniciar a pontuação</p>
                </div>
              </div>
              
              <Badge className="px-3 py-1.5 bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors border border-green-500/20">
                <Shield className="h-3.5 w-3.5 mr-1.5" />
                Em andamento
              </Badge>
            </div>
            
            <div className="bg-[#1A1F2C] rounded-xl p-8 shadow-md border border-zinc-800">
              <Tabs 
                defaultValue="kata" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="bg-[#1f232e] mb-8 p-1 w-64 rounded-full inline-flex">
                  <TabsTrigger 
                    value="kata"
                    className={`relative text-sm rounded-full font-medium py-2.5 px-12 transition-all duration-300 ${
                      activeTab === "kata" 
                        ? "bg-red-500 text-white" 
                        : "text-zinc-400 hover:text-zinc-300"
                    }`}
                  >
                    {activeTab === "kata" && (
                      <span className="absolute top-2 left-4 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                    )}
                    Kata
                  </TabsTrigger>
                  <TabsTrigger 
                    value="kumite"
                    className={`relative text-sm rounded-full font-medium py-2.5 px-12 transition-all duration-300 ${
                      activeTab === "kumite" 
                        ? "bg-red-500 text-white" 
                        : "text-zinc-400 hover:text-zinc-300"
                    }`}
                  >
                    {activeTab === "kumite" && (
                      <span className="absolute top-2 left-4 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                    )}
                    Kumite
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent 
                  value="kata" 
                  className="w-full animate-fade-in transition-all duration-500 ease-in-out"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {kataMatches.map((match) => (
                      <div key={match.id} className="bg-[#141824] rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:border-red-500/30 border border-zinc-800/80">
                        <div className="bg-[#1e2334] p-3 border-b border-zinc-800 flex justify-between items-center">
                          <Badge className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 border-red-500/20">
                            Kata
                          </Badge>
                          <div className="flex items-center gap-1.5 text-zinc-400">
                            <Clock className="h-3.5 w-3.5" />
                            {match.time}
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="font-medium text-white text-lg mb-5">{match.category}</h3>
                          <div className="flex flex-col items-center justify-center mb-6">
                            <div className="bg-red-500/10 rounded-full w-20 h-20 flex items-center justify-center mb-3 border border-red-500/20">
                              <User className="h-8 w-8 text-red-400" />
                            </div>
                            <h3 className="text-white font-semibold text-lg">{match.athlete1}</h3>
                          </div>
                          <Button
                            onClick={() => handleStartMatch(match)}
                            className="w-full gap-2 bg-red-500 hover:bg-red-600 text-white py-6 transition-all duration-300"
                          >
                            <Timer className="h-5 w-5" />
                            Iniciar Pontuação
                            <ArrowRight className="h-4 w-4 ml-auto" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent 
                  value="kumite" 
                  className="w-full animate-fade-in transition-all duration-500 ease-in-out"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {kumiteMatches.map((match) => (
                      <div key={match.id} className="bg-[#141824] rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:border-red-500/30 border border-zinc-800/80">
                        <div className="bg-[#1e2334] p-3 border-b border-zinc-800 flex justify-between items-center">
                          <Badge className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 border-red-500/20">
                            Kumite
                          </Badge>
                          <div className="flex items-center gap-1.5 text-zinc-400">
                            <Clock className="h-3.5 w-3.5" />
                            {match.time}
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="font-medium text-white text-lg mb-4">{match.category}</h3>
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex flex-col items-center">
                              <div className="bg-red-500/10 rounded-full w-16 h-16 flex items-center justify-center mb-2 border border-red-500/20">
                                <User className="h-6 w-6 text-red-400" />
                              </div>
                              <span className="text-white text-sm font-medium">{match.athlete1}</span>
                            </div>
                            
                            <div className="bg-zinc-800 rounded-full h-8 w-8 flex items-center justify-center">
                              <span className="font-bold text-zinc-400 text-xs">VS</span>
                            </div>
                            
                            <div className="flex flex-col items-center">
                              <div className="bg-red-500/10 rounded-full w-16 h-16 flex items-center justify-center mb-2 border border-red-500/20">
                                <User className="h-6 w-6 text-red-400" />
                              </div>
                              <span className="text-white text-sm font-medium">{match.athlete2}</span>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleStartMatch(match)}
                            className="w-full gap-2 bg-red-500 hover:bg-red-600 text-white py-6 transition-all duration-300"
                          >
                            <Timer className="h-5 w-5" />
                            Iniciar Pontuação
                            <ArrowRight className="h-4 w-4 ml-auto" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TournamentScoring;
