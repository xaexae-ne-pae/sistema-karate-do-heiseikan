
import { Clock, Info, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface MatchCardProps {
  category: string;
  time: string;
  mat: string;
  player1: string;
  player2: string;
}

export function MatchCard({ category, time, mat, player1, player2 }: MatchCardProps) {
  return (
    <Card className="mb-4 overflow-hidden transition-all duration-300 hover:translate-x-1 hover:shadow-md hover:shadow-primary/10 dark:bg-card/90">
      {/* Cabeçalho do card */}
      <div className="bg-muted/50 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Clock className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium">{time}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          <div className="text-xs font-medium text-muted-foreground">{mat}</div>
        </div>
      </div>
      
      {/* Corpo do card */}
      <div className="p-4 pt-3">
        {/* Categoria com mais espaço */}
        <div className="mb-3 pb-2 border-b border-border/40">
          <h3 className="font-semibold text-sm">{category}</h3>
        </div>
        
        {/* Container dos jogadores com mais espaço entre eles */}
        <div className="flex items-center mb-3.5 gap-4">
          <div className="flex-1">
            <div className="text-base font-medium text-left">{player1}</div>
          </div>
          
          <div className="bg-primary/10 rounded-full h-8 w-8 flex items-center justify-center">
            <span className="font-bold text-primary text-sm">VS</span>
          </div>
          
          <div className="flex-1">
            <div className="text-base font-medium text-right">{player2}</div>
          </div>
        </div>
        
        {/* Botão de detalhes */}
        <div className="flex justify-end">
          <Button variant="outline" size="sm" className="gap-1 px-3">
            <Info className="h-3.5 w-3.5" />
            <span className="text-xs">Detalhes</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
