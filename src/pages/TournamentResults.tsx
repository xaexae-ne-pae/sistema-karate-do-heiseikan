
import { TournamentSidebar } from "@/components/TournamentSidebar";
import { Button } from "@/components/ui/button";
import { Medal, Download, Filter, Trophy } from "lucide-react";
import { useParams } from "react-router-dom";

const TournamentResults = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex min-h-screen bg-background">
      <TournamentSidebar />
      
      <div className="flex-1 ml-64">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b bg-background/95 px-8 py-4 backdrop-blur">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Resultados do Torneio</h1>
            <p className="text-muted-foreground">Visualizar resultados e classificação</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              <span>Exportar</span>
            </Button>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              <span>Filtrar</span>
            </Button>
          </div>
        </header>
        
        <main className="px-8 py-6">
          <div className="text-center py-16 border rounded-lg">
            <div className="mx-auto flex flex-col items-center">
              <Trophy className="h-10 w-10 text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium mb-1">Nenhum resultado disponível</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                O torneio ainda não possui resultados registrados.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TournamentResults;
