
import { useParams } from "react-router-dom";
import { TournamentSidebar } from "@/components/TournamentSidebar";
import { Button } from "@/components/ui/button";
import { Download, Filter, Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface TournamentResult {
  categoryName: string;
  winner: string;
  runnerUp: string;
  score?: string;
}

const FullTournamentResults = () => {
  const { id } = useParams<{ id: string }>();
  const [results, setResults] = useState<TournamentResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simula carregamento de resultados do localStorage
    const loadResults = () => {
      setIsLoading(true);
      // Aqui você buscaria os resultados reais do torneio
      // Por enquanto vamos apenas fingir que estamos carregando
      setTimeout(() => {
        const sampleResults: TournamentResult[] = [
          {
            categoryName: "Kata Masculino Adulto",
            winner: "João Silva",
            runnerUp: "Carlos Oliveira",
            score: "25.8 - 24.5"
          },
          {
            categoryName: "Kata Feminino Adulto",
            winner: "Maria Santos",
            runnerUp: "Ana Pereira",
            score: "26.2 - 25.7"
          },
          {
            categoryName: "Kumite Masculino -75kg",
            winner: "Pedro Almeida",
            runnerUp: "Lucas Martins",
            score: "5 - 3"
          }
        ];
        setResults(sampleResults);
        setIsLoading(false);
      }, 1000);
    };
    
    loadResults();
  }, [id]);

  return (
    <div className="flex min-h-screen bg-background">
      <TournamentSidebar />
      
      <div className="flex-1 ml-0 md:ml-64">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b bg-background/95 px-4 md:px-8 py-4 backdrop-blur">
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
        
        <main className="px-4 md:px-8 py-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Resultados Finais</h2>
              
              <div className="rounded-md border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left p-4 font-medium">Categoria</th>
                      <th className="text-left p-4 font-medium">Campeão</th>
                      <th className="text-left p-4 font-medium">Vice-campeão</th>
                      <th className="text-left p-4 font-medium">Pontuação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr 
                        key={index}
                        className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}
                      >
                        <td className="p-4">{result.categoryName}</td>
                        <td className="p-4 font-medium">{result.winner}</td>
                        <td className="p-4">{result.runnerUp}</td>
                        <td className="p-4">{result.score || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 border rounded-lg">
              <div className="mx-auto flex flex-col items-center">
                <Trophy className="h-10 w-10 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium mb-1">Nenhum resultado disponível</h3>
                <p className="text-muted-foreground mb-4 max-w-md">
                  O torneio ainda não possui resultados registrados.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default FullTournamentResults;
