
import { Tournament, TournamentFormData } from "@/types/tournament";

// Mock data for tournaments
const MOCK_TOURNAMENTS: Tournament[] = [
  {
    id: 1,
    name: "Copa Shotokan - 3ª Etapa",
    date: "25/04/2025",
    time: "09:00",
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
    time: "10:00",
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
    time: "08:30",
    location: "Arena Carioca, Rio de Janeiro",
    status: "upcoming",
    categoriesCount: 15,
    athletesCount: 0,
    description: "Maior competição nacional de karatê do ano."
  }
];

// Get all tournaments
export const getAllTournaments = async (): Promise<Tournament[]> => {
  // Get tournaments from localStorage if available, otherwise use mock data
  const storedTournaments = localStorage.getItem('karate_tournaments');
  if (storedTournaments) {
    return JSON.parse(storedTournaments);
  }

  // Simulating API delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  // Initialize with mock data
  localStorage.setItem('karate_tournaments', JSON.stringify(MOCK_TOURNAMENTS));
  return MOCK_TOURNAMENTS;
};

// Save tournament
export const saveTournament = async (tournamentData: Partial<Tournament>): Promise<Tournament> => {
  // Simulating API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Get current tournaments
  const storedTournaments = localStorage.getItem('karate_tournaments');
  const tournaments = storedTournaments ? JSON.parse(storedTournaments) : MOCK_TOURNAMENTS;
  
  let savedTournament: Tournament;
  
  if (tournamentData.id && tournaments.some((t: Tournament) => t.id === tournamentData.id)) {
    // Update existing tournament
    savedTournament = {
      ...tournaments.find((t: Tournament) => t.id === tournamentData.id),
      ...tournamentData
    } as Tournament;
    
    const updatedTournaments = tournaments.map((t: Tournament) => 
      t.id === tournamentData.id ? savedTournament : t
    );
    
    localStorage.setItem('karate_tournaments', JSON.stringify(updatedTournaments));
  } else {
    // Create new tournament
    savedTournament = {
      id: Math.max(0, ...tournaments.map((t: Tournament) => t.id)) + 1,
      name: tournamentData.name || "Unnamed Tournament",
      date: tournamentData.date || new Date().toISOString(),
      time: tournamentData.time || "08:00",
      location: tournamentData.location || "No location set",
      description: tournamentData.description || "",
      status: tournamentData.status || "upcoming",
      categoriesCount: tournamentData.categoriesCount || 0,
      athletesCount: tournamentData.athletesCount || 0
    };
    
    tournaments.push(savedTournament);
    localStorage.setItem('karate_tournaments', JSON.stringify(tournaments));
  }
  
  return savedTournament;
};

// Finalize tournament
export const finalizeTournament = async (id: number): Promise<Tournament> => {
  // Simulating API delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  const storedTournaments = localStorage.getItem('karate_tournaments');
  const tournaments = storedTournaments ? JSON.parse(storedTournaments) : MOCK_TOURNAMENTS;
  
  const tournament = tournaments.find((t: Tournament) => t.id === id);
  if (!tournament) {
    throw new Error("Tournament not found");
  }
  
  const updatedTournament = {
    ...tournament,
    status: 'completed' as const
  };
  
  const updatedTournaments = tournaments.map((t: Tournament) => 
    t.id === id ? updatedTournament : t
  );
  
  localStorage.setItem('karate_tournaments', JSON.stringify(updatedTournaments));
  
  return updatedTournament;
};
