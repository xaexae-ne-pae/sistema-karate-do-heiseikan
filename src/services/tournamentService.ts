
import { Tournament } from "@/types/tournament";

// Mock tournament API functions
export const saveTournament = async (tournamentData: Partial<Tournament>): Promise<Tournament> => {
  // Simulating API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // In a real app, this would be a network request
  const savedTournament: Tournament = {
    id: tournamentData.id || Math.floor(Math.random() * 10000),
    name: tournamentData.name || "Unnamed Tournament",
    date: tournamentData.date || new Date().toISOString(),
    location: tournamentData.location || "No location set",
    description: tournamentData.description || "",
    status: tournamentData.status || "upcoming",
    categoriesCount: tournamentData.categoriesCount || 0,
    athletesCount: tournamentData.athletesCount || 0
  };
  
  return savedTournament;
};
