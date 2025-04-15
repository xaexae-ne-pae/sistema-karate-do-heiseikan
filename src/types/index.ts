
// Define tipos para os dados do Karate

// Tipo de luta: kata ou kumite
export type MatchType = "kata" | "kumite";

// Dados básicos da luta
export interface MatchData {
  id: string;
  type: MatchType;
  category: string;
  athlete1: string;
  athlete2?: string; // Opcional para lutas de kata
  mat?: string;
  time?: string;
}

// Pontuação para kata
export interface KataScore {
  judge1: number;
  judge2: number;
  judge3: number;
}

// Pontuação para um atleta no kumite
export interface KumiteAthleteScore {
  yuko: number;
  wazari: number;
  ippon: number;
  penalties: number;
  hansoku: number;
  shikkaku: number;
  // Novas propriedades para tipos específicos de penalidades
  chukoku: number;
  keikoku: number;
  jogai: number;
  mubobi: number;
  hansokuChui: number;
}

// Pontuação para kumite (dois atletas)
export interface KumiteScore {
  athlete1: KumiteAthleteScore;
  athlete2: KumiteAthleteScore;
}

// Dados completos do placar
export interface ScoreboardData {
  match: MatchData;
  timeLeft: number;
  isRunning: boolean;
  kataScore: KataScore | null;
  kumiteScore: KumiteScore | null;
  lastUpdate: number;
  senshu?: "athlete1" | "athlete2" | null; // Propriedade senshu para controlar a vantagem
}

// Interface para Atleta
export interface Athlete {
  id: number;
  name: string;
  age?: number;
  gender?: string;
  weight?: number;
  height?: number;
  belt?: string;
  team?: string;
  country?: string;
  categories?: string[];
}
