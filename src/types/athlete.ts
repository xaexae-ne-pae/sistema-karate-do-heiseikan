
export enum BeltType {
  WHITE = "white",
  YELLOW = "yellow",
  RED = "red",
  ORANGE = "orange",
  GREEN = "green",
  PURPLE = "purple",
  BROWN = "brown",
  BLACK = "black"
}

export enum DojoType {
  DO_HEISEIKAN = "do-heiseikan",
  SHOTOKAN = "shotokan",
  GOJU_RYU = "goju-ryu",
  WADO_RYU = "wado-ryu",
  SHITO_RYU = "shito-ryu",
  KYOKUSHIN = "kyokushin"
}

export enum CategoryType {
  KATA_INDIVIDUAL = "Kata Individual",
  KATA_TEAM = "Kata Equipe",
  KUMITE_60 = "Kumite -60kg",
  KUMITE_67 = "Kumite -67kg",
  KUMITE_75 = "Kumite -75kg",
  KUMITE_84 = "Kumite -84kg",
  KUMITE_PLUS_84 = "Kumite +84kg"
}

export interface Athlete {
  id: number;
  name: string;
  age: number;
  weight: number;
  height?: number;
  category: string;
  status: boolean;
  belt: string;
  dojo?: string;
  notes?: string;
}

export interface AthleteFormData {
  name: string;
  age: string | number;
  weight: string | number;
  height?: string | number;
  category: string;
  status: boolean;
  belt: string;
  dojo?: string;
  notes?: string;
}
