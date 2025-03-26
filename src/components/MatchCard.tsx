
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
    <div className="glass-card hover:mr-5 rounded-lg p-4 mb-4 transition-all duration-700 ease hover:scale-105 hover:outline hover:outline-primary/50 hover:translate-x-1">
      <div className="flex items-center gap-2 mb-2 text-muted-foreground">
        <div className="flex items-center gap-3">
          <Clock className="h-3.5 w-3.5 text-primary/80" />
          <span className="text-xs">{time}</span>
        </div>
        <div className="text-xs px-1.5 py-0.5 rounded-full bg-muted">{mat}</div>
      </div>
      
      <div className="mb-3">
        <h3 className="font-semibold text-sm mb-1.5">{category}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm font-medium text-left flex-1">{player1}</div>
            <div className="mx-2 font-bold text-primary text-base">VS</div>
            <div className="text-sm font-medium text-right flex-1">{player2}</div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button variant="outline" size="sm" className="gap-1 h-7 px-2 text-xs">
          <Info className="h-3 w-3" />
          Detalhes
        </Button>
      </div>
    </div>
  );
}
