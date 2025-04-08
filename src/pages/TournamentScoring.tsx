
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TournamentSidebar } from "@/components/TournamentSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, Timer, User, ChevronRight, Calendar, Shield, ArrowRight } from "lucide-react";

interface MatchData {
  id: number;
  type: "kata" | "kumite";
  athlete1: string;
  athlete2: string;
  category: string;
  time: string;
}

const TournamentScoring = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("kata");
  
  // Mock data for upcoming kata matches
  const kataMatches: MatchData[] = [
    { id: 4, type: "kata", athlete1: "Juliana Costa", athlete2: "Fernanda Lima", category: "Adulto Feminino", time: "16:00" },
    { id: 5, type: "kata", athlete1: "Ricardo Alves", athlete2: "Bruno Gomes", category: "Adulto Masculino", time: "16:15" },
    { id: 8, type: "kata", athlete1: "Ana Pereira", athlete2: "Camila Silva", category: "Juvenil Feminino", time: "17:20" }
  ];
  
  // Mock data for upcoming kumite matches
  const kumiteMatches: MatchData[] = [
    { id: 6, type: "kumite", athlete1: "Marcos Paulo", athlete2: "Gabriel Souza", category: "Adulto Masculino -84kg", time: "16:30" },
    { id: 7, type: "kumite", athlete1: "Camila Ferreira", athlete2: "Patrícia Ramos", category: "Adulto Feminino -61kg", time: "16:45" },
    { id: 9, type: "kumite", athlete1: "Thiago Martins", athlete2: "Lucas Almeida", category: "Juvenil Masculino -70kg", time: "17:00" }
  ];

  const handleStartMatch = (matchId: number) => {
    console.log(`Iniciando luta ID: ${matchId}`);
    // Navigation would be implemented here
  };
  
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
                    className={`text-sm rounded-md font-medium py-2 ${activeTab === "kata" ? "bg-secondary/20" : ""}`}
                  >
                    Kata
                  </TabsTrigger>
                  <TabsTrigger 
                    value="kumite" 
                    className={`text-sm rounded-md font-medium py-2 ${activeTab === "kumite" ? "bg-primary/20" : ""}`}
                  >
                    Kumite
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="kata" className="animate-fade-in">
                  <div className="grid grid-cols-3 gap-6">
                    {kataMatches.map((match) => (
                      <Card 
                        key={match.id} 
                        className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] flex flex-col hover-glow"
                      >
                        <div className="bg-gradient-to-r from-secondary/20 to-secondary/5 p-4">
                          <div className="flex justify-between items-center mb-2">
                            <Badge variant="secondary" className="capitalize text-xs px-2 py-0.5 rounded-md">
                              Kata
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
                              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-2">
                                <User className="h-5 w-5 text-secondary" />
                              </div>
                              <span className="font-medium text-sm">{match.athlete1}</span>
                            </div>
                            
                            <div className="flex items-center justify-center">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted/50 font-semibold text-xs text-muted-foreground">
                                VS
                              </div>
                            </div>
                            
                            <div className="col-span-2 flex flex-col items-center text-center">
                              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-2">
                                <User className="h-5 w-5 text-secondary" />
                              </div>
                              <span className="font-medium text-sm">{match.athlete2}</span>
                            </div>
                          </div>
                          
                          <Button 
                            className="mt-4 gap-2 bg-secondary/90 hover:bg-secondary shadow-sm rounded-full py-2.5 text-sm font-medium group"
                            onClick={() => handleStartMatch(match.id)}
                          >
                            <Timer className="h-4 w-4" />
                            <span>Iniciar Pontuação</span>
                            <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="kumite" className="animate-fade-in">
                  <div className="grid grid-cols-3 gap-6">
                    {kumiteMatches.map((match) => (
                      <Card 
                        key={match.id} 
                        className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] flex flex-col hover-glow"
                      >
                        <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-4">
                          <div className="flex justify-between items-center mb-2">
                            <Badge className="capitalize text-xs px-2 py-0.5 rounded-md">
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
                            className="mt-4 gap-2 shadow-sm rounded-full py-2.5 text-sm font-medium group"
                            onClick={() => handleStartMatch(match.id)}
                          >
                            <Timer className="h-4 w-4" />
                            <span>Iniciar Pontuação</span>
                            <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </div>
                      </Card>
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
