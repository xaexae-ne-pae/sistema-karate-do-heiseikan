
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tournament } from "@/types/tournament";
import { finalizeTournament } from "@/services/tournamentService";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TournamentSidebar } from "@/components/TournamentSidebar";
import { TournamentHeader } from "@/components/tournament/TournamentHeader";
import { Calendar, MapPin, Users, Tag, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TournamentDetails() {
  const { id } = useParams<{ id: string }>();
  const tournamentId = parseInt(id || "0");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        setLoading(true);
        // Get from localStorage
        const storedTournaments = localStorage.getItem('karate_tournaments');
        if (storedTournaments) {
          const tournaments = JSON.parse(storedTournaments);
          const tournament = tournaments.find((t: Tournament) => t.id === tournamentId);
          
          if (tournament) {
            setTournament(tournament);
          } else {
            toast({
              title: "Erro",
              description: "Torneio não encontrado",
              variant: "destructive",
            });
            navigate("/torneios");
          }
        }
      } catch (error) {
        console.error("Error fetching tournament:", error);
        toast({
          title: "Erro",
          description: "Erro ao carregar o torneio",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [tournamentId, navigate, toast]);

  const handleFinalizeTournament = async () => {
    if (!tournament) return;
    
    try {
      const updatedTournament = await finalizeTournament(tournament.id);
      setTournament(updatedTournament);
      toast({
        title: "Torneio finalizado",
        description: `O torneio "${tournament.name}" foi finalizado com sucesso.`,
      });
    } catch (error) {
      console.error("Error finalizing tournament:", error);
      toast({
        title: "Erro",
        description: "Erro ao finalizar o torneio",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <TournamentSidebar />
        <div className="flex-1 md:ml-64"> {/* Added margin to prevent content from entering sidebar */}
          <div className="container py-6 h-full">
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse text-lg">Carregando...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="flex h-screen">
        <TournamentSidebar />
        <div className="flex-1 md:ml-64"> {/* Added margin to prevent content from entering sidebar */}
          <div className="container py-6 h-full">
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <h2 className="text-xl">Torneio não encontrado</h2>
              <Button onClick={() => navigate("/torneios")}>Voltar para Torneios</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <TournamentSidebar />
      <div className="flex-1 md:ml-64"> {/* Added margin to prevent content from entering sidebar */}
        <TournamentHeader 
          title={tournament.name} 
          description={`${tournament.location} • ${tournament.date} às ${tournament.time}`}
        >
          {tournament.status === "active" && (
            <Button 
              onClick={handleFinalizeTournament}
              variant="outline"
              className="bg-primary/10 text-primary hover:bg-primary/20"
            >
              Finalizar Torneio
            </Button>
          )}
        </TournamentHeader>
        
        <div className="container py-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Informações Gerais do Torneio */}
            <Card className="col-span-2">
              <CardHeader className="pb-2">
                <CardTitle>Informações do Torneio</CardTitle>
                <CardDescription>Detalhes e configurações gerais</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Data e Hora</p>
                      <p className="font-medium">{tournament.date} às {tournament.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Local</p>
                      <p className="font-medium">{tournament.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <div>
                        {tournament.status === 'active' && (
                          <Badge className="bg-green-500 text-white">Em Andamento</Badge>
                        )}
                        {tournament.status === 'upcoming' && (
                          <Badge variant="outline">Próximo</Badge>
                        )}
                        {tournament.status === 'completed' && (
                          <Badge variant="secondary">Concluído</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {tournament.description && (
                    <div className="mt-6 border-t pt-4">
                      <h3 className="text-sm font-medium mb-2">Descrição</h3>
                      <p className="text-sm text-muted-foreground">{tournament.description}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas do Torneio */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Estatísticas</CardTitle>
                <CardDescription>Resumo de participantes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Atletas</p>
                      <p className="font-medium">{tournament.athletesCount} participantes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Tag className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Categorias</p>
                      <p className="font-medium">{tournament.categoriesCount} categorias</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
