
import { useState } from "react";
import { useParams } from "react-router-dom";
import { TournamentSidebar } from "@/components/TournamentSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Clock, Timer, User, Shield } from "lucide-react";

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
    <div className="flex min-h-screen bg-background">
      <TournamentSidebar />
      
      <div className="flex-1 ml-64">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b bg-background/95 px-8 py-4 backdrop-blur">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Pontuação do Torneio</h1>
            <p className="text-muted-foreground">Gerencie pontuações de katas e kumites</p>
          </div>
        </header>
        
        <main className="px-8 py-6">
          {/* Recent Matches Overview */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Últimas Lutas</h2>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              {recentMatches.map((match) => (
                <Card key={match.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={match.type === "kata" ? "secondary" : "default"} className="capitalize">
                      {match.type}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{match.time}</span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <h3 className="font-medium">{match.category}</h3>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{match.athlete1}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">vs</span>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{match.athlete2}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
          
          {/* Kata and Kumite Tabs */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Próximas Lutas</h2>
            </div>
            
            <Tabs defaultValue="kata" onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="kata">Kata</TabsTrigger>
                <TabsTrigger value="kumite">Kumite</TabsTrigger>
              </TabsList>
              
              <TabsContent value="kata">
                <div className="grid gap-6 md:grid-cols-2">
                  {kataMatches.map((match) => (
                    <Card key={match.id} className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium">{match.category}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <Clock className="h-4 w-4" />
                            <span>{match.time}</span>
                          </div>
                        </div>
                        <Badge variant="secondary" className="capitalize">
                          Kata
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{match.athlete1}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">vs</span>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{match.athlete2}</span>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full gap-2"
                        onClick={() => handleStartMatch(match.id)}
                      >
                        <Timer className="h-4 w-4" />
                        <span>Iniciar Pontuação</span>
                      </Button>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="kumite">
                <div className="grid gap-6 md:grid-cols-2">
                  {kumiteMatches.map((match) => (
                    <Card key={match.id} className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium">{match.category}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <Clock className="h-4 w-4" />
                            <span>{match.time}</span>
                          </div>
                        </div>
                        <Badge className="capitalize">
                          Kumite
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{match.athlete1}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">vs</span>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{match.athlete2}</span>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full gap-2"
                        onClick={() => handleStartMatch(match.id)}
                      >
                        <Timer className="h-4 w-4" />
                        <span>Iniciar Pontuação</span>
                      </Button>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </section>
        </main>
      </div>
    </div>
  );
};

export default TournamentScoring;
