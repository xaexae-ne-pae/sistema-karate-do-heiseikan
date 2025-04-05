
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Flag, Plus, Search, Trophy, Users, ChevronRight, Shield, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tournament } from "@/types/tournament";
import { useToast } from "@/hooks/use-toast";
import { getAllTournaments } from "@/services/tournamentService";
import { AddTournamentDialog } from "@/components/tournament/AddTournamentDialog";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";

const Tournaments = () => {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddTournamentDialogOpen, setIsAddTournamentDialogOpen] = useState(false);
  const [tournamentToFinalize, setTournamentToFinalize] = useState<Tournament | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchTournaments();
  }, []);
  
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
  
  const handleAddTournament = () => {
    setIsAddTournamentDialogOpen(true);
  };
  
  const handleTournamentAdded = (newTournament: Tournament) => {
    setTournaments(prevTournaments => [...prevTournaments, newTournament]);
  };
  
  const handleEnterTournament = (id: number) => {
    navigate(`/torneios/${id}`);
  };

  const handleFinalizeTournament = (tournament: Tournament) => {
    setTournamentToFinalize(tournament);
  };

  const confirmFinalizeTournament = () => {
    if (!tournamentToFinalize) return;

    setTournaments(prevTournaments => 
      prevTournaments.map(t => 
        t.id === tournamentToFinalize.id 
          ? { ...t, status: 'completed' as const } 
          : t
      )
    );

    toast({
      title: "Torneio finalizado",
      description: `O torneio "${tournamentToFinalize.name}" foi finalizado com sucesso.`
    });

    setTournamentToFinalize(null);
  };
  
  const filteredTournaments = tournaments.filter(tournament => 
    tournament.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const activeTournaments = filteredTournaments.filter(t => t.status === 'active');
  const upcomingTournaments = filteredTournaments.filter(t => t.status === 'upcoming');
  const completedTournaments = filteredTournaments.filter(t => t.status === 'completed');
  
  // Render the tournament card
  const renderTournamentCard = (tournament: Tournament) => (
    <div 
      key={tournament.id}
      className="rounded-lg border border-border/40 bg-card/30 overflow-hidden hover:border-primary/20 hover:bg-card/40 transition-colors cursor-pointer"
      onClick={() => handleEnterTournament(tournament.id)}
    >
      <div className="p-5 border-b border-border/20">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{tournament.name}</h3>
          {tournament.status === 'active' && (
            <Badge className="bg-green-500 text-white capitalize">
              Em Andamento
            </Badge>
          )}
          {tournament.status === 'upcoming' && (
            <Badge variant="outline" className="capitalize">
              Próximo
            </Badge>
          )}
          {tournament.status === 'completed' && (
            <Badge variant="secondary" className="capitalize">
              Concluído
            </Badge>
          )}
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
          
          {tournament.status === 'active' && (
            <Button 
              variant="outline" 
              className="px-3"
              onClick={(e) => {
                e.stopPropagation();
                handleFinalizeTournament(tournament);
              }}
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const renderAddTournamentCard = () => (
    <button 
      className="rounded-lg border border-dashed border-border flex flex-col items-center justify-center p-12 text-center cursor-pointer hover:border-primary/40 hover:bg-background/30 transition-colors"
      onClick={handleAddTournament}
    >
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Plus className="h-6 w-6 text-primary" />
      </div>
      <h3 className="font-medium mb-1">Adicionar Torneio</h3>
      <p className="text-sm text-muted-foreground">
        Crie um novo torneio para gerenciar
      </p>
    </button>
  );
  
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
              onClick={handleAddTournament}
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
                      onClick={handleAddTournament}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Adicionar Torneio</span>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeTournaments.map(tournament => renderTournamentCard(tournament))}
                    {renderAddTournamentCard()}
                  </div>
                )}
              </div>
              
              <div className="mb-10">
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
                      onClick={handleAddTournament}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Agendar Torneio</span>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingTournaments.map(tournament => renderTournamentCard(tournament))}
                    {upcomingTournaments.length > 0 && upcomingTournaments.length < 3 && renderAddTournamentCard()}
                  </div>
                )}
              </div>
              
              {/* Completed Tournaments Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Flag className="h-5 w-5 text-blue-500" />
                  <h2 className="text-xl font-semibold">Torneios Finalizados</h2>
                </div>
                <p className="text-muted-foreground mb-5">
                  Torneios que já foram concluídos
                </p>
                
                {completedTournaments.length === 0 ? (
                  <div className="text-center py-12 border border-dashed rounded-lg">
                    <CheckCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-1">Nenhum torneio finalizado</h3>
                    <p className="text-muted-foreground mb-4">
                      Os torneios finalizados aparecerão aqui.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedTournaments.map(tournament => renderTournamentCard(tournament))}
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Add Tournament Dialog */}
      <AddTournamentDialog 
        isOpen={isAddTournamentDialogOpen}
        onClose={() => setIsAddTournamentDialogOpen(false)}
        onTournamentAdded={handleTournamentAdded}
      />

      {/* Finalize Tournament Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={!!tournamentToFinalize}
        onClose={() => setTournamentToFinalize(null)}
        onConfirm={confirmFinalizeTournament}
        title="Finalizar Torneio"
        description={tournamentToFinalize ? `Tem certeza que deseja finalizar o torneio "${tournamentToFinalize.name}"? Esta ação não pode ser desfeita.` : ""}
      />
    </div>
  );
};

export default Tournaments;
