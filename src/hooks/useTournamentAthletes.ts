
import { useState, useEffect, useCallback } from "react";
import { Athlete } from "@/types/athlete";
import { useToast } from "@/hooks/use-toast";

interface UseTournamentAthletesResult {
  tournamentAthletes: Athlete[];
  isLoading: boolean;
  error: string | null;
  addAthlete: (athlete: Athlete) => Athlete;
  removeAthlete: (athleteId: number) => void;
  updateAthlete: (athlete: Athlete) => void;
}

export const useTournamentAthletes = (tournamentId: string | undefined): UseTournamentAthletesResult => {
  const [tournamentAthletes, setTournamentAthletes] = useState<Athlete[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load athletes data for the tournament
  useEffect(() => {
    const fetchTournamentAthletes = async () => {
      if (!tournamentId) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        // For now, we'll just simulate fetching athletes for a specific tournament
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
        const errorMessage = "Não foi possível carregar os atletas deste torneio.";
        setError(errorMessage);
        toast({
          title: "Erro",
          description: errorMessage,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTournamentAthletes();
  }, [tournamentId, toast]);

  // Function to add an athlete to the tournament
  const addAthlete = useCallback((athlete: Athlete) => {
    const updatedAthletes = [...tournamentAthletes, athlete];
    setTournamentAthletes(updatedAthletes);
    
    // Save to localStorage for demo purposes
    if (tournamentId) {
      const key = `tournament_${tournamentId}_athletes`;
      localStorage.setItem(key, JSON.stringify(updatedAthletes));
    }
    
    toast({
      title: "Atleta adicionado",
      description: `${athlete.name} foi adicionado(a) ao torneio com sucesso.`
    });
    
    return athlete;
  }, [tournamentAthletes, tournamentId, toast]);

  // Function to remove an athlete from the tournament
  const removeAthlete = useCallback((athleteId: number) => {
    const updatedAthletes = tournamentAthletes.filter(athlete => athlete.id !== athleteId);
    setTournamentAthletes(updatedAthletes);
    
    // Save to localStorage for demo purposes
    if (tournamentId) {
      const key = `tournament_${tournamentId}_athletes`;
      localStorage.setItem(key, JSON.stringify(updatedAthletes));
    }
    
    toast({
      title: "Atleta removido",
      description: "O atleta foi removido do torneio com sucesso."
    });
  }, [tournamentAthletes, tournamentId, toast]);

  // Function to update an athlete
  const updateAthlete = useCallback((updatedAthlete: Athlete) => {
    const updatedAthletes = tournamentAthletes.map(athlete => 
      athlete.id === updatedAthlete.id ? updatedAthlete : athlete
    );
    
    setTournamentAthletes(updatedAthletes);
    
    // Save to localStorage for demo purposes
    if (tournamentId) {
      const key = `tournament_${tournamentId}_athletes`;
      localStorage.setItem(key, JSON.stringify(updatedAthletes));
    }
    
    toast({
      title: "Atleta atualizado",
      description: `${updatedAthlete.name} foi atualizado(a) com sucesso.`
    });
  }, [tournamentAthletes, tournamentId, toast]);

  return {
    tournamentAthletes,
    isLoading,
    error,
    addAthlete,
    removeAthlete,
    updateAthlete
  };
};
