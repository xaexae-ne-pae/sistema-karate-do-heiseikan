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
  Flag, Star, Plus, Minus, X, ArrowLeft, Play, Pause, RefreshCcw
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

  // Timer state
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Mock data for upcoming kata matches
  const kataMatches: MatchData[] = [
    { id: 4, type: "kata", athlete1: "Juliana Costa", athlete2: null, category: "Adulto Feminino", time: "16:00" },
    { id: 5, type: "kata", athlete1: "Ricardo Alves", athlete2: null, category: "Adulto Masculino", time: "16:15" },
    { id: 8, type: "kata", athlete1: "Ana Pereira", athlete2: null, category: "Juvenil Feminino", time: "17:20" }
  ];
  
  // Mock data for upcoming kumite matches
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
    // Reset and stop timer
    setTimeLeft(180);
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setScoringMode(true);
  };

  // Timer functions
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

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Format time to MM:SS
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
      
      // For non-penalty scores, limit to reasonable values
      if ((scoreType === 'ippon' || scoreType === 'hansoku' || scoreType === 'shikkaku') && newValue > 1) {
        return prev;
      }
      
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
    
    // Calculate total scores
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
          
          <main className="flex-1 overflow-auto">
            <div className="max-w-6xl mx-auto p-6">
              {/* Timer Component */}
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-xl shadow-sm border border-border/30 mb-6">
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
                <div className="mt-4 flex justify-center">
                  <div className={`text-5xl font-bold px-8 py-4 rounded-lg ${
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
                <div className="space-y-6">
                  <div className="bg-card shadow-md rounded-xl overflow-hidden border border-border/40">
                    <div className="bg-gradient-to-r from-primary/10 to-transparent p-6 border-b border-border/30">
                      <div className="flex flex-col items-center mb-6">
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-3 border-2 border-primary/20">
                          <User className="h-10 w-10 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-1">{currentMatch.athlete1}</h3>
                        <p className="text-sm text-muted-foreground">{currentMatch.category}</p>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {(['judge1', 'judge2', 'judge3'] as const).map((judge, index) => (
                          <div key={judge} className="space-y-3">
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

                      <div className="mt-8 pt-6 border-t border-border/30">
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-medium">Pontuação Total:</span>
                          <div className="bg-gradient-to-r from-primary/20 to-primary/10 px-8 py-4 rounded-lg">
                            <span className="text-3xl font-bold text-primary">
                              {calculateKataTotal().toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSaveScore}
                      className="gap-2 bg-primary hover:bg-primary/90 px-8 py-6 text-base shadow-md rounded-lg"
                    >
                      <Trophy className="h-5 w-5" />
                      Salvar Pontuação
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Athletes header */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gradient-to-r from-primary/10 to-transparent rounded-xl p-5 text-center shadow-sm border border-border/30">
                      <div className="flex justify-center mb-3">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                          <User className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg">{currentMatch.athlete1}</h3>
                    </div>
                    <div className="bg-gradient-to-r from-primary/10 to-transparent rounded-xl p-5 text-center shadow-sm border border-border/30">
                      <div className="flex justify-center mb-3">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                          <User className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg">{currentMatch.athlete2}</h3>
                    </div>
                  </div>

                  {/* Scoring section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Athlete 1 Scoring */}
                    <div className="space-y-5 border border-border/30 rounded-xl overflow-hidden shadow-sm bg-card">
                      <div className="bg-gradient-to-r from-primary/10 to-transparent p-4 border-b border-border/30">
                        <h3 className="font-semibold text-lg text-center">Pontuação - {currentMatch.athlete1}</h3>
                      </div>
                      
                      <div className="p-5">
                        {/* Points section */}
                        <div className="space-y-3 pb-4 mb-4 border-b border-border/30">
                          <h4 className="font-medium text-sm uppercase text-muted-foreground flex items-center gap-1.5">
                            <Trophy className="h-4 w-4 text-primary" />
                            Pontos
                          </h4>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-2 rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors">
                              <Label className="text-base font-medium">Yuko (1pt)</Label>
                              <div className="flex items-center gap-3">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 border-primary/20"
                                  onClick={() => handleKumiteScoreChange('athlete1', 'yuko', -1)}
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </Button>
                                <span className="w-10 text-center font-semibold text-lg">
                                  {kumiteScore.athlete1.yuko}
                                </span>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 border-primary/20"
                                  onClick={() => handleKumiteScoreChange('athlete1', 'yuko', 1)}
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>

                            <div className="flex justify-between items-center p-2 rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors">
                              <Label className="text-base font-medium">Waza-ari (2pts)</Label>
                              <div className="flex items-center gap-3">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 border-primary/20"
                                  onClick={() => handleKumiteScoreChange('athlete1', 'wazari', -1)}
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </Button>
                                <span className="w-10 text-center font-semibold text-lg">
                                  {kumiteScore.athlete1.wazari}
                                </span>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 border-primary/20"
                                  onClick={() => handleKumiteScoreChange('athlete1', 'wazari', 1)}
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>

                            <div className="flex justify-between items-center p-2 rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors">
                              <Label className="text-base font-medium">Ippon (3pts)</Label>
                              <div className="flex items-center gap-3">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 border-primary/20"
                                  onClick={() => handleKumiteScoreChange('athlete1', 'ippon', -1)}
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </Button>
                                <span className="w-10 text-center font-semibold text-lg">
                                  {kumiteScore.athlete1.ippon}
                                </span>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 border-primary/20"
                                  onClick={() => handleKumiteScoreChange('athlete1', 'ippon', 1)}
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Penalties section */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-sm uppercase text-muted-foreground flex items-center gap-1.5">
                            <Flag className="h-4 w-4 text-red-500" />
                            Penalidades
                          </h4>
                          
                          <div className="grid grid-cols-1 gap-2">
                            <div className="flex justify-between items-center p-2 rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors">
                              <Label className="text-base font-medium flex items-center gap-1.5">
                                <Flag className="h-4 w-4 text-yellow-500" />
                                Chukoku
                              </Label>
                              <div className="flex items-center gap-3">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 border-yellow-500/20"
                                  onClick={() => handleKumiteScoreChange('athlete1', 'chukoku', -1)}
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </Button>
                                <span className="w-10 text-center font-semibold text-lg">
                                  {kumiteScore.athlete1.chukoku}
                                </span>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 border-yellow-500/20"
                                  onClick={() => handleKumiteScoreChange('athlete1', 'chukoku', 1)}
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>

                            <div className="flex justify-between items-center p-2 rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors">
                              <Label className="text-base font-medium flex items-center gap-1.5">
                                <Flag className="h-4 w-4 text-yellow-500" />
                                Keikoku
                              </Label>
                              <div className="flex items-center gap-3">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 border-yellow-500/20"
                                  onClick={() => handleKumiteScoreChange('athlete1', 'keikoku', -1)}
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </Button>
                                <span className="w-10 text-center font-semibold text-lg">
                                  {kumiteScore.athlete1.keikoku}
                                </span>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 border-yellow-500/20"
                                  onClick={() => handleKumiteScoreChange('athlete1', 'keikoku', 1)}
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>

                            <div className="flex justify-between items-center p-2 rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors">
                              <Label className="text-base font-medium flex items-center gap-1.5">
                                <Flag className="h-4 w-4 text-yellow-500" />
                                Jogai
                              </Label>
                              <div className="flex items-center gap-3">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 border-yellow-500/20"
                                  onClick={() => handleKumiteScoreChange('athlete1', 'jogai', -1)}
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </Button>
                                <span className="w-10 text-center font-semibold text-lg">
                                  {kumiteScore.athlete1.jogai}
                                </span>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 border-yellow-500/20"
                                  onClick={() => handleKumiteScoreChange('athlete1', 'jogai', 1)}
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>

                            <div className="flex justify-between items-center p-2 rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors">
                              <Label className="text-base font-medium flex items-center gap-1.5">
                                <Flag className="h-4 w-4 text-yellow-500" />
                                Mubobi
                              </Label>
                              <div className="flex items-center gap-3">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 border-yellow-500/20"
                                  onClick={() => handleKumiteScoreChange('athlete1', 'mubobi', -1)}
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </Button>
                                <span className="w-10 text-center font-semibold text-lg">
                                  {kumiteScore.athlete1.mubobi}
                                </span>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 border-yellow-500/20"
                                  onClick={() => handleKumiteScoreChange('athlete1', 'mubobi', 1)}
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>

                            <div className="flex justify-between items-center p-2 rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors">
                              <Label className="text-base font-medium flex items-center gap-1.5">
                                <Flag className="h-4 w-4 text-orange-500" />
                                Hansoku-Chui
                              </Label>
                              <div className="flex items-center gap-3">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 border-orange-500/20"
                                  onClick={() => handleKumiteScoreChange('athlete1', 'hansokuChui', -1)}
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </Button>
                                <span className="w-10 text-center font-semibold text-lg">
                                  {kumiteScore.athlete1.hansokuChui}
                                </span>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 border-orange-500/20"
                                  onClick={() => handleKumiteScoreChange('athlete1', 'hansokuChui', 1)}
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>

                            <div className="flex justify-between items-center p-2 rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors">
                              <Label className="text-base font-medium flex items-center gap-1.5">
                                <Flag className="h-4 w-4 text-red-500" />
                                Hansoku
                              </Label>
                              <div className="flex items-center gap-3">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 border-red-500/20"
                                  onClick={() => handleKumiteScoreChange('athlete1', 'hansoku', -1)}
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </Button>
                                <span className="w-10 text-center font-semibold text-lg">
                                  {kumiteScore.athlete1.hansoku}
                                </span>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 border-red-500/20"
                                  onClick={() => handleKumiteScoreChange('athlete1', 'hansoku', 1)}
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>

                            <div className="flex justify-between items-center p-2 rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors">
                              <Label className="text-base font-medium flex items-center gap-1.5">
                                <Flag className="h-4 w-4 text-red-500" />
                                Shikkaku
                              </Label>
                              <div className="flex items-center gap-3">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 border-red-500/20"
                                  onClick={() => handleKumiteScoreChange('athlete1', 'shikkaku', -1)}
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </Button>
                                <span className="w-10 text-center font-semibold text-lg">
                                  {kumiteScore.athlete1.shikkaku}
                                </span>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className
