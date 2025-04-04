
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TournamentSidebar } from "@/components/TournamentSidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Swords, Award, PenTool, ExternalLink } from "lucide-react";

const TournamentScoring = () => {
  const { id: tournamentId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("kumite");
  
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
    window.open(`/scoring-fullscreen/${matchId}?type=${matchType}`, "_blank");
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
          <Tabs defaultValue="kumite" onValueChange={setActiveTab} className="mb-6">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kumiteMatches.map((match) => (
                  <Card key={match.id} className="overflow-hidden border-border/30 shadow-md hover:shadow-lg transition-all">
                    <CardHeader className="bg-primary/10 border-b">
                      <CardTitle className="text-lg">
                        {match.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <span>{match.athlete1.name}</span>
                        </div>
                        <div className="font-bold text-lg">VS</div>
                        <div className="flex items-center gap-2">
                          <span>{match.athlete2.name}</span>
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90 gap-2 mt-2"
                        onClick={() => navigate(`/scoring?matchId=${match.id}`)}
                      >
                        <Trophy className="h-4 w-4" />
                        <span>Pontuar</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full mt-3 gap-2 border-border/30"
                        onClick={() => openFullScreenScoring(match.id, "kumite")}
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Tela Cheia</span>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="kata" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kataMatches.map((match) => (
                  <Card key={match.id} className="overflow-hidden border-border/30 shadow-md hover:shadow-lg transition-all">
                    <CardHeader className="bg-primary/10 border-b">
                      <CardTitle className="text-lg">
                        {match.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <span>{match.athlete1.name}</span>
                        </div>
                        <div className="font-bold text-lg">VS</div>
                        <div className="flex items-center gap-2">
                          <span>{match.athlete2.name}</span>
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90 gap-2 mt-2"
                        onClick={() => navigate(`/scoring?matchId=${match.id}`)}
                      >
                        <Award className="h-4 w-4" />
                        <span>Pontuar</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full mt-3 gap-2 border-border/30"
                        onClick={() => openFullScreenScoring(match.id, "kata")}
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Tela Cheia</span>
                      </Button>
                    </CardContent>
                  </Card>
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
