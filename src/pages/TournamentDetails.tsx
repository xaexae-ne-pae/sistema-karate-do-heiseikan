
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tournament } from "@/types/tournament";
import { finalizeTournament } from "@/services/tournamentService";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TournamentHeader } from "@/components/tournament/TournamentHeader";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TournamentSidebar } from "@/components/TournamentSidebar";

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
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-lg">Carregando...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!tournament) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <h2 className="text-xl">Torneio não encontrado</h2>
          <Button onClick={() => navigate("/torneios")}>Voltar para Torneios</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <TournamentSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="container py-6 h-full">
          <TournamentHeader tournament={tournament} />
          
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-full flex justify-end">
              {tournament.status === "active" && (
                <Button 
                  onClick={handleFinalizeTournament}
                  variant="outline"
                  className="bg-primary/10 text-primary hover:bg-primary/20"
                >
                  Finalizar Torneio
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
