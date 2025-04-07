
import { Tournament, TournamentFormData } from "@/types/tournament";

// Helper function to determine tournament status based on date and time
export const determineTournamentStatus = (dateStr: string, timeStr: string): "upcoming" | "active" | "completed" => {
  const today = new Date();
  const [day, month, year] = dateStr.split('/').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  
  // Create tournament date object (note: month is 0-indexed in JavaScript Date)
  const tournamentDate = new Date(year, month - 1, day, hours, minutes);
  
  // Compare with current date and time
  if (tournamentDate > today) {
    return "upcoming";
  } else if (tournamentDate.getDate() === today.getDate() && 
             tournamentDate.getMonth() === today.getMonth() && 
             tournamentDate.getFullYear() === today.getFullYear()) {
    return "active";
  } else {
    return "completed";
  }
};

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
  try {
    // Get tournaments from localStorage if available, otherwise use mock data
    const storedTournaments = localStorage.getItem('karate_tournaments');
    let tournaments: Tournament[];
    
    if (storedTournaments) {
      tournaments = JSON.parse(storedTournaments);
      
      // Update status based on date and time for each tournament
      const updatedTournaments = tournaments.map((t: Tournament) => {
        // Skip completed tournaments
        if (t.status === "completed") return t;
        
        // Determine current status based on date and time
        const currentStatus = determineTournamentStatus(t.date, t.time);
        return { ...t, status: currentStatus };
      });
      
      // Save updated statuses
      localStorage.setItem('karate_tournaments', JSON.stringify(updatedTournaments));
      return updatedTournaments;
    } else {
      // Initialize with mock data
      localStorage.setItem('karate_tournaments', JSON.stringify(MOCK_TOURNAMENTS));
      return MOCK_TOURNAMENTS;
    }
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    
    // Return empty array instead of throwing error
    return [];
  }
};

// Save tournament
export const saveTournament = async (tournamentData: Partial<Tournament>): Promise<Tournament> => {
  try {
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
      // Format date if needed
      let dateStr = tournamentData.date || new Date().toLocaleDateString('pt-BR');
      
      // Check if dateStr is a Date object and convert to string if needed
      if (typeof dateStr !== 'string') {
        dateStr = new Date(dateStr).toLocaleDateString('pt-BR');
      }
      
      // Determine status based on date and time
      const timeStr = tournamentData.time || "08:00";
      const status = determineTournamentStatus(dateStr, timeStr);
      
      // Create new tournament
      savedTournament = {
        id: Math.max(0, ...tournaments.map((t: Tournament) => t.id)) + 1,
        name: tournamentData.name || "Unnamed Tournament",
        date: dateStr,
        time: timeStr,
        location: tournamentData.location || "No location set",
        description: tournamentData.description || "",
        status: status,
        categoriesCount: tournamentData.categoriesCount || 0,
        athletesCount: tournamentData.athletesCount || 0
      };
      
      tournaments.push(savedTournament);
      localStorage.setItem('karate_tournaments', JSON.stringify(tournaments));
    }
    
    return savedTournament;
  } catch (error) {
    console.error("Error saving tournament:", error);
    throw new Error("Falha ao salvar o torneio");
  }
};

// Finalize tournament
export const finalizeTournament = async (id: number): Promise<Tournament> => {
  try {
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
  } catch (error) {
    console.error("Error finalizing tournament:", error);
    throw new Error("Falha ao finalizar o torneio");
  }
};
