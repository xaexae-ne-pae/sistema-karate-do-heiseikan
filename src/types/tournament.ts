
export type TournamentStatus = "upcoming" | "active" | "completed";

export interface Tournament {
  id: number;
  name: string;
  date: string;
  location: string;
  status: TournamentStatus;
  categoriesCount: number;
  athletesCount: number;
  description?: string;
}

export interface TournamentFormData {
  name: string;
  location: string;
  description: string;
  date?: Date;
  status?: TournamentStatus;
}
