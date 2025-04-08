
import { useState } from "react";
import { useParams } from "react-router-dom";
import { TournamentSidebar } from "@/components/TournamentSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, Clock, Timer, User, ChevronRight, Calendar } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<string>("kata");
  
  // Mock data for recent matches
  const recentMatches: MatchData[] = [
    { id: 1, type: "kumite", athlete1: "João Silva", athlete2: "Carlos Mendes", category: "Adulto Masculino -75kg", time: "15:30" },
    { id: 2, type: "kata", athlete1: "Ana Clara", athlete2: "Mariana Souza", category: "Adulto Feminino", time: "14:45" },
    { id: 3, type: "kumite", athlete1: "Pedro Santos", athlete2: "Lucas Oliveira", category: "Juvenil Masculino -60kg", time: "13:20" }
  ];
  
  // Mock data for upcoming kata matches
  const kataMatches: MatchData[] = [
    { id: 4, type: "kata", athlete1: "Juliana Costa", athlete2: "Fernanda Lima", category: "Adulto Feminino", time: "16:00" },
    { id: 5, type: "kata", athlete1: "Ricardo Alves", athlete2: "Bruno Gomes", category: "Adulto Masculino", time: "16:15" }
  ];
  
  // Mock data for upcoming kumite matches
  const kumiteMatches: MatchData[] = [
    { id: 6, type: "kumite", athlete1: "Marcos Paulo", athlete2: "Gabriel Souza", category: "Adulto Masculino -84kg", time: "16:30" },
    { id: 7, type: "kumite", athlete1: "Camila Ferreira", athlete2: "Patrícia Ramos", category: "Adulto Feminino -61kg", time: "16:45" }
  ];

  const handleStartMatch = (matchId: number) => {
    console.log(`Iniciando luta ID: ${matchId}`);
    // Navigation would be implemented here
  };
  
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <TournamentSidebar />
      
      <div className="flex-1 ml-64 flex flex-col">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b bg-background/95 px-6 py-3 backdrop-blur">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Pontuação do Torneio</h1>
            <p className="text-sm text-muted-foreground">Gerencie pontuações de katas e kumites</p>
          </div>
        </header>
        
        <main className="flex-1 grid grid-cols-2 gap-4 p-4 overflow-hidden">
          {/* Recent Matches Section */}
          <section className="h-full">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                <Trophy className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-semibold">Últimas Lutas</h2>
            </div>
            
            <ScrollArea className="h-[calc(100vh-180px)]">
              <div className="pr-4 space-y-3">
                {recentMatches.map((match) => (
                  <Card 
                    key={match.id} 
                    className="p-3 hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] border-l-4 border-l-primary"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={match.type === "kata" ? "secondary" : "default"} className="capitalize text-xs rounded-md px-2 py-0.5">
                        {match.type}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-md">
                        <Clock className="h-3 w-3" />
                        <span>{match.time}</span>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <h3 className="font-medium text-sm">{match.category}</h3>
                    </div>
                    
                    <div className="flex justify-between items-center bg-muted/20 p-2 rounded-lg">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-3 w-3 text-primary" />
                        </div>
                        <span className="font-medium text-sm">{match.athlete1}</span>
                      </div>
                      <div className="px-1.5 py-0.5 rounded-full text-xs bg-muted/50 text-muted-foreground">vs</div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-sm">{match.athlete2}</span>
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-3 w-3 text-primary" />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </section>
          
          {/* Upcoming Matches Section */}
          <section className="h-full">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                <Calendar className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-semibold">Próximas Lutas</h2>
            </div>
            
            <Tabs defaultValue="kata" onValueChange={setActiveTab} className="w-full h-[calc(100vh-180px)]">
              <TabsList className="mb-3 p-0.5 bg-muted/30 w-[200px]">
                <TabsTrigger value="kata" className="text-sm rounded-md">Kata</TabsTrigger>
                <TabsTrigger value="kumite" className="text-sm rounded-md">Kumite</TabsTrigger>
              </TabsList>
              
              <TabsContent value="kata" className="h-full overflow-hidden animate-fade-in">
                <ScrollArea className="h-[calc(100vh-220px)]">
                  <div className="pr-4 space-y-3">
                    {kataMatches.map((match) => (
                      <Card key={match.id} className="overflow-hidden border-0 shadow-lg">
                        <div className="bg-gradient-to-r from-secondary/20 to-secondary/5 p-3">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <h3 className="font-semibold text-sm">{match.category}</h3>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                <Clock className="h-3 w-3" />
                                <span>{match.time}</span>
                              </div>
                            </div>
                            <Badge variant="secondary" className="capitalize text-xs px-2 py-0.5 rounded-md">
                              Kata
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="p-3">
                          <div className="flex justify-between items-center mb-3 bg-muted/20 p-2 rounded-lg">
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              <span className="font-medium text-xs">{match.athlete1}</span>
                            </div>
                            <div className="w-7 h-7 rounded-full flex items-center justify-center bg-muted/30 font-semibold text-xs text-muted-foreground">
                              VS
                            </div>
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              <span className="font-medium text-xs">{match.athlete2}</span>
                            </div>
                          </div>
                          
                          <Button 
                            className="w-full gap-1 rounded-full py-1.5 text-sm"
                            onClick={() => handleStartMatch(match.id)}
                          >
                            <Timer className="h-3.5 w-3.5" />
                            <span>Iniciar Pontuação</span>
                            <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="kumite" className="h-full overflow-hidden animate-fade-in">
                <ScrollArea className="h-[calc(100vh-220px)]">
                  <div className="pr-4 space-y-3">
                    {kumiteMatches.map((match) => (
                      <Card key={match.id} className="overflow-hidden border-0 shadow-lg">
                        <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-3">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <h3 className="font-semibold text-sm">{match.category}</h3>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                <Clock className="h-3 w-3" />
                                <span>{match.time}</span>
                              </div>
                            </div>
                            <Badge className="capitalize text-xs px-2 py-0.5 rounded-md">
                              Kumite
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="p-3">
                          <div className="flex justify-between items-center mb-3 bg-muted/20 p-2 rounded-lg">
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              <span className="font-medium text-xs">{match.athlete1}</span>
                            </div>
                            <div className="w-7 h-7 rounded-full flex items-center justify-center bg-muted/30 font-semibold text-xs text-muted-foreground">
                              VS
                            </div>
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              <span className="font-medium text-xs">{match.athlete2}</span>
                            </div>
                          </div>
                          
                          <Button 
                            className="w-full gap-1 rounded-full py-1.5 text-sm"
                            onClick={() => handleStartMatch(match.id)}
                          >
                            <Timer className="h-3.5 w-3.5" />
                            <span>Iniciar Pontuação</span>
                            <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </section>
        </main>
      </div>
    </div>
  );
};

export default TournamentScoring;
