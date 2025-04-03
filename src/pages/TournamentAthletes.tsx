
import { useState } from "react";
import { useParams } from "react-router-dom";
import { TournamentSidebar } from "@/components/TournamentSidebar";
import { Button } from "@/components/ui/button";
import { UserPlus, Search } from "lucide-react";
import { Athlete } from "@/types/athlete";
import { useTournamentAthletes } from "@/hooks/useTournamentAthletes";
import { useSearchFilter } from "@/hooks/useSearchFilter";
import { SearchBar } from "@/components/tournament/SearchBar";
import { AthletesList } from "@/components/tournament/AthletesList";
import { AddAthleteDialog } from "@/components/tournament/AddAthleteDialog";
import { Skeleton } from "@/components/ui/skeleton";

const TournamentAthletes = () => {
  const { id: tournamentId } = useParams<{ id: string }>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Use custom hook for tournament athletes data
  const { 
    tournamentAthletes, 
    isLoading, 
    addAthlete 
  } = useTournamentAthletes(tournamentId);
  
  // Use custom hook for search filtering
  const { 
    searchQuery, 
    setSearchQuery, 
    filteredItems: filteredAthletes 
  } = useSearchFilter<Athlete>(
    tournamentAthletes,
    (athlete, query) => 
      athlete.name.toLowerCase().includes(query) || 
      athlete.category.toLowerCase().includes(query)
  );
  
  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);
  
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
            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar atletas..."
            />
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : (
            <AthletesList 
              athletes={filteredAthletes}
              isFiltered={searchQuery.length > 0}
              searchQuery={searchQuery}
              onAddClick={handleOpenDialog}
            />
          )}
        </main>
      </div>
      
      <AddAthleteDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onSuccess={addAthlete} 
      />
    </div>
  );
};

export default TournamentAthletes;
