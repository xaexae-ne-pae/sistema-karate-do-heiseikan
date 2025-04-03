
import { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { TournamentSidebar } from "@/components/TournamentSidebar";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Athlete } from "@/types/athlete";
import { useTournamentAthletes } from "@/hooks/useTournamentAthletes";
import { useSearchFilter } from "@/hooks/useSearchFilter";
import { SearchBar } from "@/components/tournament/SearchBar";
import { AthletesList } from "@/components/tournament/AthletesList";
import { AddAthleteDialog } from "@/components/tournament/AddAthleteDialog";
import { LoadingAthletes } from "@/components/tournament/LoadingAthletes";
import { TournamentHeader } from "@/components/tournament/TournamentHeader";

const TournamentAthletes = () => {
  const { id: tournamentId } = useParams<{ id: string }>();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  
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
    filteredItems: filteredAthletes,
    isFiltered 
  } = useSearchFilter<Athlete>(
    tournamentAthletes,
    (athlete, query) => 
      athlete.name.toLowerCase().includes(query) || 
      athlete.category.toLowerCase().includes(query)
  );
  
  const handleOpenDialog = useCallback(() => {
    setIsDialogOpen(true);
  }, []);
  
  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
  }, []);
  
  const handleAthleteClick = useCallback((athlete: Athlete) => {
    console.log("Athlete clicked:", athlete);
    // You can add additional functionality here
  }, []);
  
  return (
    <div className="flex min-h-screen bg-background">
      <TournamentSidebar />
      
      <div className="flex-1 ml-64">
        <TournamentHeader 
          title="Atletas do Torneio"
          description="Gerenciar atletas inscritos neste torneio"
        >
          <Button onClick={handleOpenDialog} className="gap-2">
            <UserPlus className="h-4 w-4" />
            <span>Adicionar Atleta</span>
          </Button>
        </TournamentHeader>
        
        <main className="px-8 py-6">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar atletas..."
            />
          </div>
          
          {isLoading ? (
            <LoadingAthletes />
          ) : (
            <AthletesList 
              athletes={filteredAthletes}
              isFiltered={isFiltered}
              searchQuery={searchQuery}
              onAddClick={handleOpenDialog}
              onAthleteClick={handleAthleteClick}
            />
          )}
        </main>
      </div>
      
      <AddAthleteDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onSuccess={(athlete) => {
          addAthlete(athlete);
          setIsDialogOpen(false);
        }} 
      />
    </div>
  );
};

export default TournamentAthletes;
