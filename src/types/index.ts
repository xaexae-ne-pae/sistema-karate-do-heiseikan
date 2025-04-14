
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
}

// Pontuação para kumite (dois atletas)
export interface KumiteScore {
  athlete1: KumiteAthleteScore;
  athlete2: KumiteAthleteScore;
}
