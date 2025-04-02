
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { TournamentSidebar } from "@/components/TournamentSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserPlus, Search, X } from "lucide-react";
import { AthleteForm } from "@/components/AthleteForm";
import { useToast } from "@/hooks/use-toast";

interface Athlete {
  id: number;
  name: string;
  age: number;
  weight: number;
  height?: number;
  category: string;
  status: boolean;
  belt: string;
  dojo?: string;
  notes?: string;
}

const TournamentAthletes = () => {
  const { id: tournamentId } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tournamentAthletes, setTournamentAthletes] = useState<Athlete[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchTournamentAthletes = async () => {
      setIsLoading(true);
      
      try {
        // For now, we'll just simulate fetching athletes for a specific tournament
        // In a real app, you would fetch this data from your API
        
        // For demo, let's check if there are any saved tournament athletes in localStorage
        const key = `tournament_${tournamentId}_athletes`;
        const savedAthletes = localStorage.getItem(key);
        
        if (savedAthletes) {
          setTournamentAthletes(JSON.parse(savedAthletes));
        } else {
          // No athletes for this tournament yet
          setTournamentAthletes([]);
        }
      } catch (error) {
        console.error("Error fetching tournament athletes:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os atletas deste torneio.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTournamentAthletes();
  }, [tournamentId, toast]);
  
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleAddAthlete = (athlete: Athlete) => {
    // Add athlete to this tournament
    const updatedAthletes = [...tournamentAthletes, athlete];
    setTournamentAthletes(updatedAthletes);
    
    // Save to localStorage for demo purposes
    const key = `tournament_${tournamentId}_athletes`;
    localStorage.setItem(key, JSON.stringify(updatedAthletes));
    
    toast({
      title: "Atleta adicionado",
      description: `${athlete.name} foi adicionado(a) ao torneio com sucesso.`
    });
    
    setIsDialogOpen(false);
  };
  
  const filteredAthletes = tournamentAthletes.filter(athlete =>
    athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    athlete.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-background">
      <TournamentSidebar />
      
      <div className="flex-1 ml-64">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b bg-background/95 px-8 py-4 backdrop-blur">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Atletas do Torneio</h1>
            <p className="text-muted-foreground">
              Gerenciar atletas inscritos neste torneio
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button onClick={handleOpenDialog} className="gap-2">
              <UserPlus className="h-4 w-4" />
              <span>Adicionar Atleta</span>
            </Button>
          </div>
        </header>
        
        <main className="px-8 py-6">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar atletas..."
                className="w-full pl-9 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <X
                  className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer"
                  onClick={() => setSearchQuery("")}
                />
              )}
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <p className="text-muted-foreground">Carregando atletas...</p>
            </div>
          ) : filteredAthletes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAthletes.map((athlete) => (
                <div key={athlete.id} className="border rounded-lg p-4 bg-card">
                  <h3 className="font-medium">{athlete.name}</h3>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p>Categoria: {athlete.category}</p>
                    <p>Idade: {athlete.age} anos</p>
                    <p>Peso: {athlete.weight} kg</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border rounded-lg">
              <h3 className="font-medium mb-2">
                Nenhum atleta inscrito neste torneio
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? `Nenhum atleta encontrado para "${searchQuery}"`
                  : "Adicione atletas a este torneio para começar."
                }
              </p>
              <Button 
                variant="outline" 
                className="gap-2" 
                onClick={handleOpenDialog}
              >
                <UserPlus className="h-4 w-4" />
                <span>Adicionar Atleta</span>
              </Button>
            </div>
          )}
        </main>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Adicionar Atleta ao Torneio</DialogTitle>
            <DialogDescription>
              Selecione um atleta para adicionar a este torneio.
            </DialogDescription>
          </DialogHeader>
          
          <AthleteForm 
            onSuccess={(athlete) => handleAddAthlete(athlete as Athlete)} 
            initialData={null}
            onAthleteUpdated={() => {}}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TournamentAthletes;
