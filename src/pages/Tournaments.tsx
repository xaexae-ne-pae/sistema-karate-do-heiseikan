import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Plus, Search, Trophy } from "lucide-react";
import { Tournament } from "@/types/tournament";
import { useToast } from "@/hooks/use-toast";
import { getAllTournaments } from "@/services/tournamentService";
import { AddTournamentDialog } from "@/components/tournament/AddTournamentDialog";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { TournamentList } from "@/components/tournament/TournamentList";

const Tournaments = () => {
  const [tournaments, setTournaments] = useLocalStorage<Tournament[]>('karate_tournaments', []);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddTournamentDialogOpen, setIsAddTournamentDialogOpen] = useState(false);
  const [tournamentToFinalize, setTournamentToFinalize] = useState<Tournament | null>(null);
  const { toast } = useToast();
  
  const fetchTournaments = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedTournaments = await getAllTournaments();
      setTournaments(fetchedTournaments);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      setIsLoading(false);
    }
  }, [setTournaments]);
  
  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);
  
  const handleAddTournament = () => {
    setIsAddTournamentDialogOpen(true);
  };
  
  const handleTournamentAdded = (newTournament: Tournament) => {
    setTournaments([...tournaments, newTournament]);
  };
  
  const handleFinalizeTournament = (tournament: Tournament) => {
    setTournamentToFinalize(tournament);
  };

  const confirmFinalizeTournament = () => {
    if (!tournamentToFinalize) return;

    const updatedTournaments = tournaments.map(t => 
      t.id === tournamentToFinalize.id 
        ? { ...t, status: 'completed' as const } 
        : t
    );
    
    setTournaments(updatedTournaments);

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
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 ml-0 md:ml-64">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b bg-background/95 px-4 md:px-8 py-4 backdrop-blur">
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
              <span className="hidden sm:inline">Novo Torneio</span>
            </Button>
          </div>
        </header>
        
        <main className="px-4 md:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar torneios..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <Calendar className="h-4 w-4" />
              <span>Calendário</span>
            </Button>
          </div>
          
          <TournamentList 
            activeTournaments={activeTournaments}
            upcomingTournaments={upcomingTournaments}
            completedTournaments={completedTournaments}
            onAddTournament={handleAddTournament}
            onFinalizeTournament={handleFinalizeTournament}
            isLoading={isLoading}
          />
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
