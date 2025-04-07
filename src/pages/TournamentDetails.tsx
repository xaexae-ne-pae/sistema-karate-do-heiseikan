
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tournament } from "@/types/tournament";
import { finalizeTournament } from "@/services/tournamentService";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TournamentSidebar } from "@/components/TournamentSidebar";
import { TournamentHeader } from "@/components/tournament/TournamentHeader";
import { Calendar, MapPin, Users, Tag, Shield, Award, ChevronRight, Clock, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MatchDetails } from "@/components/MatchDetails";

export default function TournamentDetails() {
  const { id } = useParams<{ id: string }>();
  const tournamentId = parseInt(id || "0");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMatchDetails, setShowMatchDetails] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);

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

  const openMatchDetails = (match: any) => {
    setSelectedMatch(match);
    setShowMatchDetails(true);
  };

  // Mock data for upcoming matches
  const upcomingMatches = [
    {
      id: 1,
      category: "Kata Masculino Adulto",
      time: "14:30",
      mat: "Tatame 1",
      player1: "João Silva",
      player2: "Carlos Oliveira",
      round: "Eliminatória"
    },
    {
      id: 2,
      category: "Kumite Feminino -55kg",
      time: "15:15",
      mat: "Tatame 2",
      player1: "Maria Santos",
      player2: "Ana Pereira",
      round: "Semifinal"
    },
    {
      id: 3,
      category: "Kata Feminino Juvenil",
      time: "16:00",
      mat: "Tatame 1",
      player1: "Júlia Costa",
      player2: "Beatriz Lima",
      round: "Final"
    }
  ];

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
      <div className="flex-1 md:ml-64 overflow-y-auto"> {/* Added margin to prevent content from entering sidebar */}
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

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Duração Estimada</p>
                      <p className="font-medium">8 horas</p>
                    </div>
                  </div>

                  {tournament.description && (
                    <div className="mt-6 border-t pt-4">
                      <h3 className="text-sm font-medium mb-2">Descrição</h3>
                      <p className="text-sm text-muted-foreground">{tournament.description || "Campeonato regional de karatê com diversas categorias e modalidades."}</p>
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
                      <p className="font-medium">{tournament.athletesCount || 0} participantes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Tag className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Categorias</p>
                      <p className="font-medium">{tournament.categoriesCount || 0} categorias</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Lutas Realizadas</p>
                      <p className="font-medium">0 de {(tournament.athletesCount || 0) > 0 ? Math.floor((tournament.athletesCount || 0) * 0.7) : 0}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => navigate(`/torneios/${tournamentId}/resultados`)}
                >
                  Ver Resultados
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Próximas Lutas */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Próximas Lutas</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingMatches.map((match) => (
                <Card key={match.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2 bg-muted/30">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">{match.category}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" /> {match.time} • {match.mat}
                        </CardDescription>
                      </div>
                      <Badge variant={match.round === "Final" ? "default" : "outline"}>
                        {match.round}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="text-left flex-1">
                        <p className="font-medium truncate max-w-[100px]">{match.player1}</p>
                      </div>
                      
                      <div className="bg-primary/10 rounded-full h-7 w-7 flex items-center justify-center mx-2">
                        <span className="font-bold text-primary text-xs">VS</span>
                      </div>
                      
                      <div className="text-right flex-1">
                        <p className="font-medium truncate max-w-[100px]">{match.player2}</p>
                      </div>
                    </div>
                  </CardContent>
                  <Separator />
                  <CardFooter className="pt-3 pb-3">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-xs gap-1 hover:bg-muted" 
                      onClick={() => openMatchDetails(match)}
                    >
                      <Info className="h-3.5 w-3.5" />
                      <span>Detalhes</span>
                      <ChevronRight className="h-3.5 w-3.5 ml-auto" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          {/* Organizadores e Árbitros */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Equipe do Torneio</h2>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Organizadores e Árbitros</CardTitle>
                <CardDescription>Equipe responsável pelo torneio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="font-medium text-sm mb-3">Equipe Organizadora</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10">MS</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">Mestre Sato</p>
                          <p className="text-xs text-muted-foreground">Coordenador Geral</p>
                        </div>
                      </li>
                      <li className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10">FR</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">Fernando Rocha</p>
                          <p className="text-xs text-muted-foreground">Diretor Técnico</p>
                        </div>
                      </li>
                      <li className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10">CL</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">Carla Lima</p>
                          <p className="text-xs text-muted-foreground">Coordenadora de Inscrições</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm mb-3">Árbitros</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10">RO</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">Ricardo Oliveira</p>
                          <p className="text-xs text-muted-foreground">Árbitro Central</p>
                        </div>
                      </li>
                      <li className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10">JS</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">Juliana Santos</p>
                          <p className="text-xs text-muted-foreground">Árbitra Kumite</p>
                        </div>
                      </li>
                      <li className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10">MC</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">Marcos Costa</p>
                          <p className="text-xs text-muted-foreground">Árbitro Kata</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modal for match details */}
        {selectedMatch && (
          <MatchDetails 
            isOpen={showMatchDetails} 
            onClose={() => setShowMatchDetails(false)} 
            match={selectedMatch} 
          />
        )}
      </div>
    </div>
  );
}

// Import Avatar component
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
