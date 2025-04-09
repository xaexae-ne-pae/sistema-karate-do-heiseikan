
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TournamentSidebar } from "@/components/TournamentSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Trophy, Timer, User, Calendar, Shield, ArrowRight, 
  Flag, Star, Plus, Minus, X, ArrowLeft
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
    wazari: number;
    ippon: number;
    penalties: number;
  };
  athlete2: {
    wazari: number;
    ippon: number;
    penalties: number;
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
    athlete1: { wazari: 0, ippon: 0, penalties: 0 },
    athlete2: { wazari: 0, ippon: 0, penalties: 0 },
  });
  
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
        athlete1: { wazari: 0, ippon: 0, penalties: 0 },
        athlete2: { wazari: 0, ippon: 0, penalties: 0 },
      });
    }
    setScoringMode(true);
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
    scoreType: 'wazari' | 'ippon' | 'penalties',
    change: number
  ) => {
    setKumiteScore(prev => {
      const newValue = Math.max(0, prev[athlete][scoreType] + change);
      
      // For ippon, max is 1 per match
      if (scoreType === 'ippon' && newValue > 1) {
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
    setScoringMode(false);
  };
  
  if (scoringMode && currentMatch) {
    return (
      <div className="flex h-screen bg-background overflow-hidden">
        <TournamentSidebar />
        
        <div className="flex-1 ml-64 flex flex-col">
          <header className="sticky top-0 z-40 border-b bg-background/95 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleBackToMatches}
                  className="h-9 w-9"
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
          
          <main className="flex-1 p-6 overflow-hidden flex justify-center">
            <div className="w-full max-w-4xl">
              {currentMatch.type === "kata" ? (
                <div className="space-y-8">
                  <div className="bg-muted/20 p-8 rounded-xl shadow-sm border border-border/30">
                    <div className="flex flex-col items-center mb-8">
                      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <User className="h-12 w-12 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-1">{currentMatch.athlete1}</h3>
                      <p className="text-sm text-muted-foreground">{currentMatch.category}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {(['judge1', 'judge2', 'judge3'] as const).map((judge, index) => (
                        <div key={judge} className="space-y-3">
                          <Label htmlFor={judge} className="flex justify-between text-base">
                            <span>Jurado {index + 1}</span>
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
                            className="text-center text-xl font-semibold h-14 bg-background/70 border-primary/20 focus-visible:ring-primary/30"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="mt-10 pt-6 border-t border-border/30">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-medium">Pontuação Total:</span>
                        <div className="bg-primary/10 px-8 py-4 rounded-lg">
                          <span className="text-3xl font-bold text-primary">
                            {calculateKataTotal().toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSaveScore}
                      className="gap-2 bg-primary px-8 py-6 text-base"
                    >
                      <Trophy className="h-5 w-5" />
                      Salvar Pontuação
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Athletes header */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-muted/20 rounded-xl p-6 text-center shadow-sm border border-border/30">
                      <div className="flex justify-center mb-3">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg">{currentMatch.athlete1}</h3>
                    </div>
                    <div className="bg-muted/20 rounded-xl p-6 text-center shadow-sm border border-border/30">
                      <div className="flex justify-center mb-3">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg">{currentMatch.athlete2}</h3>
                    </div>
                  </div>

                  {/* Scoring section */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Athlete 1 Scoring */}
                    <div className="space-y-5 border border-border/30 rounded-xl p-6 shadow-sm">
                      <h3 className="font-semibold text-lg text-center mb-4">Pontuação</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label className="text-base font-medium">Wazari</Label>
                          <div className="flex items-center gap-3">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0"
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
                              className="h-8 w-8 p-0"
                              onClick={() => handleKumiteScoreChange('athlete1', 'wazari', 1)}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label className="text-base font-medium">Ippon</Label>
                          <div className="flex items-center gap-3">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0"
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
                              className="h-8 w-8 p-0"
                              onClick={() => handleKumiteScoreChange('athlete1', 'ippon', 1)}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label className="text-base font-medium flex items-center gap-1.5">
                            <Flag className="h-4 w-4 text-yellow-500" />
                            Penalidades
                          </Label>
                          <div className="flex items-center gap-3">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleKumiteScoreChange('athlete1', 'penalties', -1)}
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </Button>
                            <span className="w-10 text-center font-semibold text-lg">
                              {kumiteScore.athlete1.penalties}
                            </span>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleKumiteScoreChange('athlete1', 'penalties', 1)}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Athlete 2 Scoring */}
                    <div className="space-y-5 border border-border/30 rounded-xl p-6 shadow-sm">
                      <h3 className="font-semibold text-lg text-center mb-4">Pontuação</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label className="text-base font-medium">Wazari</Label>
                          <div className="flex items-center gap-3">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleKumiteScoreChange('athlete2', 'wazari', -1)}
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </Button>
                            <span className="w-10 text-center font-semibold text-lg">
                              {kumiteScore.athlete2.wazari}
                            </span>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleKumiteScoreChange('athlete2', 'wazari', 1)}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label className="text-base font-medium">Ippon</Label>
                          <div className="flex items-center gap-3">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleKumiteScoreChange('athlete2', 'ippon', -1)}
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </Button>
                            <span className="w-10 text-center font-semibold text-lg">
                              {kumiteScore.athlete2.ippon}
                            </span>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleKumiteScoreChange('athlete2', 'ippon', 1)}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label className="text-base font-medium flex items-center gap-1.5">
                            <Flag className="h-4 w-4 text-yellow-500" />
                            Penalidades
                          </Label>
                          <div className="flex items-center gap-3">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleKumiteScoreChange('athlete2', 'penalties', -1)}
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </Button>
                            <span className="w-10 text-center font-semibold text-lg">
                              {kumiteScore.athlete2.penalties}
                            </span>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleKumiteScoreChange('athlete2', 'penalties', 1)}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Automatic winner indication */}
                  <div className="p-5 bg-muted/10 rounded-xl shadow-sm border border-border/30">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium">Vencedor:</span>
                      <div className="px-6 py-3 rounded-lg bg-primary/10">
                        {kumiteScore.athlete1.ippon === 1 ? (
                          <span className="font-bold text-lg">{currentMatch.athlete1}</span>
                        ) : kumiteScore.athlete2.ippon === 1 ? (
                          <span className="font-bold text-lg">{currentMatch.athlete2}</span>
                        ) : (
                          <span className="text-muted-foreground">Aguardando...</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSaveScore}
                      className="gap-2 bg-primary px-8 py-6 text-base"
                    >
                      <Trophy className="h-5 w-5" />
                      Salvar Pontuação
                    </Button>
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
    <div className="flex h-screen bg-background overflow-hidden">
      <TournamentSidebar />
      
      <div className="flex-1 ml-64 flex flex-col">
        <header className="sticky top-0 z-40 border-b bg-background/95 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Pontuação do Torneio</h1>
              <p className="text-sm text-muted-foreground">Gerencie pontuações de katas e kumites</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-3 py-1.5 flex gap-1.5 items-center">
                <Trophy className="h-3.5 w-3.5 text-primary" />
                <span>Torneio #{id}</span>
              </Badge>
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-6 overflow-hidden flex justify-center">
          <div className="w-4/5 max-w-6xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Próximas Lutas</h2>
                  <p className="text-sm text-muted-foreground">Selecione uma luta para iniciar a pontuação</p>
                </div>
              </div>
              
              <Badge className="px-3 py-1 bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors">
                <Shield className="h-3.5 w-3.5 mr-1" />
                Em andamento
              </Badge>
            </div>
            
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 shadow-sm border border-border/30">
              <Tabs 
                defaultValue="kata" 
                onValueChange={setActiveTab} 
                className="h-full"
              >
                <TabsList className="grid grid-cols-2 mb-6 bg-background/50 p-1 w-64">
                  <TabsTrigger 
                    value="kata" 
                    className={`relative text-sm rounded-md font-medium py-2.5 px-4 ${
                      activeTab === "kata" 
                        ? "bg-primary text-primary-foreground shadow-sm" 
                        : "hover:bg-muted/50"
                    }`}
                  >
                    {activeTab === "kata" && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                      </span>
                    )}
                    Kata
                  </TabsTrigger>
                  <TabsTrigger 
                    value="kumite" 
                    className={`relative text-sm rounded-md font-medium py-2.5 px-4 ${
                      activeTab === "kumite" 
                        ? "bg-primary text-primary-foreground shadow-sm" 
                        : "hover:bg-muted/50"
                    }`}
                  >
                    {activeTab === "kumite" && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                      </span>
                    )}
                    Kumite
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="kata" className="animate-fade-in">
                  <ScrollArea className="h-[calc(100vh-280px)] pr-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {kataMatches.map((match) => (
                        <Card 
                          key={match.id} 
                          className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] flex flex-col hover-glow"
                        >
                          <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-4">
                            <div className="flex justify-between items-center mb-2">
                              <Badge className="capitalize text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary dark:text-primary-foreground border-primary/20">
                                Kata
                              </Badge>
                              <div className="flex items-center gap-1 text-xs font-medium bg-background/40 px-2 py-1 rounded-full">
                                {match.time}
                              </div>
                            </div>
                            <h3 className="font-semibold text-sm">{match.category}</h3>
                          </div>
                          
                          <div className="p-4 flex-1 flex flex-col">
                            <div className="bg-muted/20 p-4 rounded-lg mb-auto flex items-center justify-center">
                              <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                                  <User className="h-8 w-8 text-primary" />
                                </div>
                                <span className="font-medium text-base">{match.athlete1}</span>
                              </div>
                            </div>
                            
                            <Button 
                              className="mt-4 gap-2 bg-primary hover:bg-primary/90 shadow-sm rounded-full py-2.5 text-sm font-medium group"
                              onClick={() => handleStartMatch(match)}
                            >
                              <Timer className="h-4 w-4" />
                              <span>Iniciar Pontuação</span>
                              <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="kumite" className="animate-fade-in">
                  <ScrollArea className="h-[calc(100vh-280px)] pr-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {kumiteMatches.map((match) => (
                        <Card 
                          key={match.id} 
                          className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] flex flex-col hover-glow"
                        >
                          <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-4">
                            <div className="flex justify-between items-center mb-2">
                              <Badge className="capitalize text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary dark:text-primary-foreground border-primary/20">
                                Kumite
                              </Badge>
                              <div className="flex items-center gap-1 text-xs font-medium bg-background/40 px-2 py-1 rounded-full">
                                {match.time}
                              </div>
                            </div>
                            <h3 className="font-semibold text-sm">{match.category}</h3>
                          </div>
                          
                          <div className="p-4 flex-1 flex flex-col">
                            <div className="grid grid-cols-5 items-center gap-2 bg-muted/20 p-3 rounded-lg mb-auto">
                              <div className="col-span-2 flex flex-col items-center text-center">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                  <User className="h-5 w-5 text-primary" />
                                </div>
                                <span className="font-medium text-sm">{match.athlete1}</span>
                              </div>
                              
                              <div className="flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted/50 font-semibold text-xs text-muted-foreground">
                                  VS
                                </div>
                              </div>
                              
                              <div className="col-span-2 flex flex-col items-center text-center">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                  <User className="h-5 w-5 text-primary" />
                                </div>
                                <span className="font-medium text-sm">{match.athlete2}</span>
                              </div>
                            </div>
                            
                            <Button 
                              className="mt-4 gap-2 bg-primary hover:bg-primary/90 shadow-sm rounded-full py-2.5 text-sm font-medium group"
                              onClick={() => handleStartMatch(match)}
                            >
                              <Timer className="h-4 w-4" />
                              <span>Iniciar Pontuação</span>
                              <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
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
