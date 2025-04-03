
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
