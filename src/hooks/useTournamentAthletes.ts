
import { useState, useEffect } from "react";
import { Athlete } from "@/types/athlete";
import { useToast } from "@/hooks/use-toast";

export const useTournamentAthletes = (tournamentId: string | undefined) => {
  const [tournamentAthletes, setTournamentAthletes] = useState<Athlete[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTournamentAthletes = async () => {
      if (!tournamentId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // For now, we'll just simulate fetching athletes for a specific tournament
        // In a real app, you would fetch this data from your API
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
        setError("Não foi possível carregar os atletas deste torneio.");
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

  const addAthlete = (athlete: Athlete) => {
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
  };

  return {
    tournamentAthletes,
    isLoading,
    error,
    addAthlete
  };
};
