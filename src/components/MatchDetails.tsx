
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface MatchDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  match: {
    category: string;
    time: string;
    mat: string;
    player1: string;
    player2: string;
    // Additional details
    round?: string;
    referee?: string;
    tournament?: string;
    expectedDuration?: string;
    notes?: string;
  };
}

export function MatchDetails({ isOpen, onClose, match }: MatchDetailsProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Detalhes da Luta</DialogTitle>
          <DialogDescription>
            Informações detalhadas sobre o confronto.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-2">
          <div className="bg-muted/30 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-lg mb-2">{match.category}</h3>
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-2">
                <span>Horário: {match.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Tatame: {match.mat}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between gap-2 my-4">
              <div className="text-left flex-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="font-medium text-base">{match.player1}</span>
                </div>
              </div>
              
              <div className="bg-primary/10 rounded-full h-8 w-8 flex items-center justify-center mx-2">
                <span className="font-bold text-primary text-sm">VS</span>
              </div>
              
              <div className="text-right flex-1">
                <div className="flex items-center gap-2 justify-end">
                  <span className="font-medium text-base">{match.player2}</span>
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Torneio</h4>
              <p className="text-sm">{match.tournament || "Copa Karate 2023"}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Rodada</h4>
                <Badge variant="outline">{match.round || "Eliminatória"}</Badge>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Árbitro</h4>
                <p className="text-sm">{match.referee || "Carlos Oliveira"}</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Duração Esperada</h4>
              <p className="text-sm">{match.expectedDuration || "3 minutos"}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Observações</h4>
              <p className="text-sm text-muted-foreground">
                {match.notes || "Não há observações adicionais para esta luta."}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
