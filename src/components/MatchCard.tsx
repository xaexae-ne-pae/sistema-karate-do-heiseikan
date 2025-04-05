
import { useState } from "react";
import { Clock, Info, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { MatchDetails } from "./MatchDetails";

interface MatchCardProps {
  category: string;
  time: string;
  mat: string;
  player1: string;
  player2: string;
  tournament?: string;
  round?: string;
  onScore?: () => void;
}

export function MatchCard({ 
  category, 
  time, 
  mat, 
  player1, 
  player2, 
  tournament, 
  round, 
  onScore 
}: MatchCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  return (
    <>
      <Card className="mb-4 overflow-hidden transition-all duration-300 hover:translate-x-1 hover:shadow-md hover:shadow-primary/10 dark:bg-card/90">
        {/* Cabeçalho do card */}
        <div className="bg-muted/50 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{time}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            <div className="text-sm font-medium text-muted-foreground">{mat}</div>
          </div>
        </div>
        
        {/* Corpo do card */}
        <div className="p-5 pt-4">
          {/* Categoria com mais espaço */}
          <div className="mb-4 pb-2 border-b border-border/40">
            <h3 className="font-semibold text-base">{category}</h3>
          </div>
          
          {/* Container dos jogadores com mais espaço entre eles */}
          <div className="flex items-center mb-4 gap-5">
            <div className="flex-1">
              <div className="text-lg font-medium text-left">{player1}</div>
            </div>
            
            <div className="bg-primary/10 rounded-full h-10 w-10 flex items-center justify-center">
              <span className="font-bold text-primary text-base">VS</span>
            </div>
            
            <div className="flex-1">
              <div className="text-lg font-medium text-right">{player2}</div>
            </div>
          </div>
          
          {/* Botão de pontuar */}
          <div className="flex justify-center">
            <Button 
              onClick={onScore}
              className="w-full gap-2 bg-red-500 hover:bg-red-600"
            >
              <span className="text-sm">Pontuar</span>
            </Button>
          </div>
          
          {/* Botão de detalhes */}
          <div className="flex justify-end mt-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1.5 px-3"
              onClick={() => setDetailsOpen(true)}
            >
              <Info className="h-4 w-4" />
              <span className="text-sm">Detalhes</span>
            </Button>
          </div>
        </div>
      </Card>
      
      <MatchDetails 
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        match={{
          category,
          time,
          mat,
          player1,
          player2,
          tournament,
          round
        }}
      />
    </>
  );
}
