
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Flag, Plus, Search, Trophy, Users, ChevronRight, BarChart2, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tournament } from "@/types/tournament";
import { useToast } from "@/hooks/use-toast";
import { getAllTournaments } from "@/services/tournamentService";

const Tournaments = () => {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setIsLoading(true);
        const fetchedTournaments = await getAllTournaments();
        setTournaments(fetchedTournaments);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
        toast({
          title: "Erro ao carregar torneios",
          description: "Não foi possível carregar a lista de torneios.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };
    
    fetchTournaments();
  }, [toast]);
  
  const handleCreateTournament = () => {
    navigate("/torneios/novo");
  };
  
  const handleEnterTournament = (id: number) => {
    navigate(`/torneios/${id}`);
  };
  
  const handleGoToScoring = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita propagar o clique para o card do torneio
    navigate(`/torneios/${id}/pontuacao`);
  };
  
  const filteredTournaments = tournaments.filter(tournament => 
    tournament.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const activeTournaments = filteredTournaments.filter(t => t.status === 'active');
  const upcomingTournaments = filteredTournaments.filter(t => t.status === 'upcoming');
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b bg-background/95 px-8 py-4 backdrop-blur">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Torneios</h1>
            <p className="text-muted-foreground">
              Gerenciar torneios e competições
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              className="gap-2" 
              onClick={handleCreateTournament}
            >
              <Trophy className="h-4 w-4" />
              <span>Novo Torneio</span>
            </Button>
          </div>
        </header>
        
        <main className="px-8 py-6">
          <div className="flex justify-between mb-8">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar torneios..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span>Calendário</span>
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid gap-4">
              {[1, 2].map((_, i) => (
                <div 
                  key={i} 
                  className="h-64 rounded-lg border border-border/40 bg-card/30 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <>
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <Flag className="h-5 w-5 text-red-500" />
                  <h2 className="text-xl font-semibold">Torneios Ativos</h2>
                </div>
                <p className="text-muted-foreground mb-5">
                  Eventos em andamento que você pode gerenciar
                </p>
                
                {activeTournaments.length === 0 ? (
                  <div className="text-center py-12 border border-dashed rounded-lg">
                    <Trophy className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-1">Nenhum torneio ativo</h3>
                    <p className="text-muted-foreground mb-4">
                      Crie um novo torneio para começar a gerenciar.
                    </p>
                    <Button 
                      onClick={handleCreateTournament}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Adicionar Torneio</span>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeTournaments.map((tournament) => (
                      <div 
                        key={tournament.id}
                        className="rounded-lg border border-border/40 bg-card/30 overflow-hidden hover:border-primary/20 hover:bg-card/40 transition-colors cursor-pointer"
                        onClick={() => handleEnterTournament(tournament.id)}
                      >
                        <div className="p-5 border-b border-border/20">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-lg">{tournament.name}</h3>
                            <Badge className="bg-green-500 text-white capitalize">
                              Em Andamento
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <Calendar className="h-4 w-4" />
                            <span>{tournament.date}</span>
                          </div>
                        </div>
                        
                        <div className="p-5">
                          {tournament.location && (
                            <div className="text-sm text-muted-foreground mb-4">
                              {tournament.location}
                            </div>
                          )}
                          
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <Shield className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{tournament.categoriesCount || 0} categorias</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{tournament.athletesCount || 0} atletas</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-3">
                            <Button 
                              className="w-full justify-between"
                              onClick={() => handleEnterTournament(tournament.id)}
                            >
                              <span>Entrar no Torneio</span>
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              className="px-3"
                              onClick={(e) => handleGoToScoring(tournament.id, e)}
                              title="Gerenciar Pontuação"
                            >
                              <BarChart2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div 
                      className="rounded-lg border border-dashed border-border flex flex-col items-center justify-center p-12 text-center cursor-pointer hover:border-primary/40 hover:bg-background/30 transition-colors"
                      onClick={handleCreateTournament}
                    >
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Plus className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-medium mb-1">Adicionar Torneio</h3>
                      <p className="text-sm text-muted-foreground">
                        Crie um novo torneio para gerenciar
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Flag className="h-5 w-5 text-gray-500" />
                  <h2 className="text-xl font-semibold">Torneios Futuros</h2>
                </div>
                <p className="text-muted-foreground mb-5">
                  Próximos torneios agendados
                </p>
                
                {upcomingTournaments.length === 0 ? (
                  <div className="text-center py-12 border border-dashed rounded-lg">
                    <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-1">Nenhum torneio agendado</h3>
                    <p className="text-muted-foreground mb-4">
                      Agende novos torneios para o futuro.
                    </p>
                    <Button
                      variant="outline"
                      onClick={handleCreateTournament}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Agendar Torneio</span>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingTournaments.map((tournament) => (
                      <div 
                        key={tournament.id}
                        className="rounded-lg border border-border/40 bg-card/30 overflow-hidden hover:border-primary/20 hover:bg-card/40 transition-colors cursor-pointer"
                        onClick={() => handleEnterTournament(tournament.id)}
                      >
                        <div className="p-5 border-b border-border/20">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-lg">{tournament.name}</h3>
                            <Badge variant="outline" className="capitalize">
                              Próximo
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <Calendar className="h-4 w-4" />
                            <span>{tournament.date}</span>
                          </div>
                        </div>
                        
                        <div className="p-5">
                          {tournament.location && (
                            <div className="text-sm text-muted-foreground mb-4">
                              {tournament.location}
                            </div>
                          )}
                          
                          <Button 
                            variant="outline" 
                            className="w-full justify-between"
                            onClick={() => handleEnterTournament(tournament.id)}
                          >
                            <span>Preparar Torneio</span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Tournaments;
