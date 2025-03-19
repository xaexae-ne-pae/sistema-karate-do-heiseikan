
import { Clock, Info } from "lucide-react";
import { Button } from "./ui/button";

interface MatchCardProps {
  category: string;
  time: string;
  mat: string;
  player1: string;
  player2: string;
}

export function MatchCard({ category, time, mat, player1, player2 }: MatchCardProps) {
  return (
    <div className="glass-card rounded-lg p-4 mb-4 animate-scale-in hover-scale hover-glow transition-all duration-300">
      <div className="flex items-center gap-3 mb-3 text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-primary/80" />
          <span className="text-sm">{time}</span>
        </div>
        <div className="text-xs px-2 py-0.5 rounded-full bg-muted">{mat}</div>
      </div>
      
      <div className="mb-3">
        <h3 className="font-semibold text-base mb-0.5">{category}</h3>
        <div className="flex items-center justify-between">
          <h4 className="text-base font-medium">{player1} <span className="text-primary">vs</span> {player2}</h4>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button variant="outline" size="sm" className="gap-1.5">
          <Info className="h-3.5 w-3.5" />
          Detalhes
        </Button>
      </div>
    </div>
  );
}
