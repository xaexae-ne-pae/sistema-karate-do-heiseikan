
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, CheckCircle, Timer, ArrowLeft } from "lucide-react";
import { Tournament } from "@/types/tournament";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { useToast } from "@/hooks/use-toast";
import { TournamentSidebar } from "@/components/TournamentSidebar";
import { finalizeTournament } from "@/services/tournamentService";

const TournamentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");
  
  useEffect(() => {
    const savedUsername = localStorage.getItem('karate_username') || '';
    const savedRole = localStorage.getItem('karate_role') || 'user';
    setUsername(savedUsername);
    setUserRole(savedRole);
    
    // Fetch tournament data
    const fetchTournament = async () => {
      setIsLoading(true);
      
      // Get tournaments from localStorage
      const storedTournaments = localStorage.getItem('karate_tournaments');
      if (storedTournaments) {
        const tournaments = JSON.parse(storedTournaments);
        const found = tournaments.find((t: Tournament) => t.id === parseInt(id || "0"));
        
        if (found) {
          setTournament(found);
          setIsLoading(false);
          return;
        }
      }
      
      // If not found, use mock data
      setTimeout(() => {
        const mockTournament: Tournament = {
          id: parseInt(id || "0"),
          name: "Campeonato Regional de Karatê 2025",
          date: "15/05/2025",
          location: "Ginásio Municipal",
          status: "active",
          categoriesCount: 12,
          athletesCount: 98,
          description: "Descrição detalhada do torneio regional de karatê, incluindo regras e categorias."
        };
        
        setTournament(mockTournament);
        setIsLoading(false);
      }, 500);
    };
    
    fetchTournament();
  }, [id]);
  
  const isAdmin = userRole === 'admin' || username === 'Francivaldo';
  const isJudge = userRole === 'judge';
  const canFinishTournament = (isAdmin || isJudge) && tournament?.status === 'active';
  
  const handleFinishTournament = async () => {
    if (!tournament) return;
    
    try {
      // Call the API to finalize the tournament
      await finalizeTournament(tournament.id);
      
      // Update tournament status locally
      setTournament({
        ...tournament,
        status: 'completed'
      });
      
      // Show success message
      toast({
        title: "Torneio finalizado",
        description: "O torneio foi finalizado com sucesso."
      });
      
      // Close dialog
      setIsConfirmDialogOpen(false);

      // Navigate back to tournaments page after 1.5 seconds
      setTimeout(() => {
        navigate("/torneios");
      }, 1500);
    } catch (error) {
      console.error("Erro ao finalizar torneio:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao finalizar o torneio.",
        variant: "destructive"
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <TournamentSidebar />
        <div className="flex-1 ml-64 p-8 flex items-center justify-center">
          <div className="animate-pulse">Carregando...</div>
        </div>
      </div>
    );
  }
  
  if (!tournament) {
    return (
      <div className="flex min-h-screen bg-background">
        <TournamentSidebar />
        <div className="flex-1 ml-64 p-8">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold">Torneio não encontrado</h2>
            <p className="text-muted-foreground mt-2">O torneio solicitado não existe ou foi removido.</p>
            <Button onClick={() => navigate("/torneios")} className="mt-4">
              Voltar para Torneios
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <TournamentSidebar />
      
      <div className="flex-1 ml-64">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b bg-background/95 px-8 py-4 backdrop-blur">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/torneios")}
              className="rounded-full" 
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{tournament?.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                {tournament?.status === 'active' ? (
                  <Badge className="bg-green-500 px-3 py-1 text-white capitalize flex items-center">
                    <Timer className="h-4 w-4 mr-1 text-white" />
                    Em Andamento
                  </Badge>
                ) : tournament?.status === 'upcoming' ? (
                  <Badge variant="outline" className="px-3 py-1 capitalize flex items-center">
                    <Timer className="h-4 w-4 mr-1" />
                    <span>Próximo</span>
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="px-3 py-1 capitalize flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span>Concluído</span>
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {canFinishTournament && (
              <Button 
                variant="outline" 
                onClick={() => setIsConfirmDialogOpen(true)}
                className="gap-2 bg-background"
              >
                <CheckCircle className="h-4 w-4" />
                Finalizar Torneio
              </Button>
            )}
          </div>
        </header>
        
        <main className="px-8 py-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Informações do Torneio</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Data</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{tournament?.date}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Local</p>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{tournament?.location}</span>
                    </div>
                  </div>
                </div>
                
                {tournament?.description && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">Descrição</p>
                    <p>{tournament.description}</p>
                  </div>
                )}
              </div>
              
              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Chaves de Competição</h2>
                <div className="text-center py-8 border rounded-lg">
                  <p className="text-muted-foreground">
                    Nenhuma chave de competição configurada.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Resumo</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-muted-foreground">Categorias</span>
                    <span className="font-medium">{tournament?.categoriesCount}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-muted-foreground">Atletas</span>
                    <span className="font-medium">{tournament?.athletesCount}</span>
                  </div>
                </div>
              </div>
              
              {tournament?.status === 'active' && (
                <div className="bg-card border rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Ações</h2>
                  <div className="space-y-3">
                    <Button className="w-full justify-between">
                      <span>Gerenciar Chaves</span>
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                    </Button>
                    <Button className="w-full justify-between">
                      <span>Registrar Resultados</span>
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      
      <ConfirmationDialog 
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleFinishTournament}
        title="Finalizar Torneio"
        description={tournament ? `Tem certeza que deseja finalizar o torneio "${tournament.name}"? Esta ação não pode ser desfeita.` : ""}
      />
    </div>
  );
};

export default TournamentDetails;
