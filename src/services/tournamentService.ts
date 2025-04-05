
import { Tournament } from "@/types/tournament";

// Mock data for tournaments
const MOCK_TOURNAMENTS: Tournament[] = [
  {
    id: 1,
    name: "Copa Shotokan - 3ª Etapa",
    date: "25/04/2025",
    location: "Ginásio Municipal, São Paulo",
    status: "active",
    categoriesCount: 12,
    athletesCount: 78,
    description: "Terceira etapa da Copa Shotokan de Karatê 2025."
  },
  {
    id: 2,
    name: "Campeonato Regional",
    date: "10/05/2025",
    location: "Centro Esportivo, Belo Horizonte",
    status: "upcoming",
    categoriesCount: 8,
    athletesCount: 45,
    description: "Campeonato regional para classificação estadual."
  },
  {
    id: 3,
    name: "Copa Brasil de Karatê",
    date: "15/06/2025",
    location: "Arena Carioca, Rio de Janeiro",
    status: "upcoming",
    categoriesCount: 15,
    athletesCount: 0,
    description: "Maior competição nacional de karatê do ano."
  }
];

// Get all tournaments
export const getAllTournaments = async (): Promise<Tournament[]> => {
  // Simulating API delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  return MOCK_TOURNAMENTS;
};

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
