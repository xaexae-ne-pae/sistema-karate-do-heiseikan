
import { useParams } from "react-router-dom";
import { TournamentSidebar } from "@/components/TournamentSidebar";

const TournamentResults = () => {
  const { id: tournamentId } = useParams<{ id: string }>();
  
  return (
    <div className="flex min-h-screen bg-background">
      <TournamentSidebar />
      
      <div className="flex-1 ml-64">
        <header className="sticky top-0 z-40 border-b bg-background/95 px-8 py-4 backdrop-blur">
          <h1 className="text-2xl font-semibold tracking-tight">Resultados</h1>
          <p className="text-muted-foreground">
            Resultados das competições deste torneio
          </p>
        </header>
        
        <main className="px-8 py-6">
          <div className="text-center py-16 border rounded-lg">
            <h3 className="font-medium mb-2">
              Nenhum resultado disponível
            </h3>
            <p className="text-muted-foreground">
              Ainda não há resultados registrados para este torneio.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TournamentResults;
