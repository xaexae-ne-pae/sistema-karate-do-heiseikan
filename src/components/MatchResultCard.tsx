
import { Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MatchResultCardProps {
  match: {
    id: number;
    category: string;
    date: string;
    tournament: string;
    athlete1: { name: string; color: string; score: number };
    athlete2: { name: string; color: string; score: number };
    winner: 'athlete1' | 'athlete2' | null;
  };
}

export function MatchResultCard({ match }: MatchResultCardProps) {
  const isKata = match.category.toLowerCase().includes('kata');

  return (
    <div className="glass-card rounded-lg p-5 animate-scale-in hover-scale hover-glow transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <Badge variant="outline">{match.category}</Badge>
        <div className="text-sm text-muted-foreground">{match.date}</div>
      </div>
      
      <div className="mb-5">
        <div className="text-sm text-muted-foreground mb-4">{match.tournament}</div>
        
        <div className="flex justify-between items-center mb-2">
          <div className={`flex items-center gap-2 ${match.winner === 'athlete1' ? 'font-semibold' : ''}`}>
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>{match.athlete1.name}</span>
            {match.winner === 'athlete1' && (
              <Award className="h-4 w-4 text-yellow-500" />
            )}
          </div>
          <div className="text-lg font-semibold">{match.athlete1.score}</div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className={`flex items-center gap-2 ${match.winner === 'athlete2' ? 'font-semibold' : ''}`}>
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>{match.athlete2.name}</span>
            {match.winner === 'athlete2' && (
              <Award className="h-4 w-4 text-yellow-500" />
            )}
          </div>
          <div className="text-lg font-semibold">{match.athlete2.score}</div>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground border-t pt-3 flex justify-between">
        <span>Vencedor: {match.winner === 'athlete1' ? match.athlete1.name : match.athlete2.name}</span>
        <span>{isKata ? 'Pontuação Kata' : 'Kumite'}</span>
      </div>
    </div>
  );
}
