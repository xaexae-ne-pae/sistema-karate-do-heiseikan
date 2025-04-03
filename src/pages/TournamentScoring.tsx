
import { useParams } from "react-router-dom";
import { TournamentSidebar } from "@/components/TournamentSidebar";

const TournamentScoring = () => {
  const { id: tournamentId } = useParams<{ id: string }>();
  
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
          <div className="text-center py-16 border rounded-lg">
            <h3 className="font-medium mb-2">
              Sistema de pontuação não configurado
            </h3>
            <p className="text-muted-foreground">
              Nenhuma luta em andamento para pontuar no momento.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TournamentScoring;
