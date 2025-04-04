
import { Button } from "@/components/ui/button";
import { ChevronsUp, ChevronUp, Award } from "lucide-react";

interface ScoringPanelProps {
  match: {
    id: number;
    category: string;
    athlete1: { name: string; color: string };
    athlete2: { name: string; color: string };
  };
  isActive: boolean;
  scores: {
    athlete1: { yuko: number, wazari: number, ippon: number };
    athlete2: { yuko: number, wazari: number, ippon: number };
  };
  onUpdateScore: (athlete: 'athlete1' | 'athlete2', type: 'yuko' | 'wazari' | 'ippon', value: number) => void;
}

export function ScoringPanel({ match, isActive, scores, onUpdateScore }: ScoringPanelProps) {
  const addPoint = (athlete: 'athlete1' | 'athlete2', type: 'yuko' | 'wazari' | 'ippon') => {
    if (!isActive) return;
    
    onUpdateScore(athlete, type, scores[athlete][type] + 1);
  };
  
  const removePoint = (athlete: 'athlete1' | 'athlete2', type: 'yuko' | 'wazari' | 'ippon') => {
    if (!isActive) return;
    if (scores[athlete][type] <= 0) return;
    
    onUpdateScore(athlete, type, scores[athlete][type] - 1);
  };

  const calculateTotal = (athlete: 'athlete1' | 'athlete2') => {
    return scores[athlete].yuko + (scores[athlete].wazari * 2) + (scores[athlete].ippon * 4);
  };

  const getWinner = () => {
    const total1 = calculateTotal('athlete1');
    const total2 = calculateTotal('athlete2');
    
    if (total1 > total2) return 'athlete1';
    if (total2 > total1) return 'athlete2';
    return null;
  };

  const winner = getWinner();

  return (
    <div className="glass-card rounded-lg p-5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Pontuação</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className={`rounded-lg p-5 border-2 ${winner === 'athlete1' ? 'border-red-500 bg-red-500/5' : 'border-muted'}`}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <h3 className="font-medium text-lg">{match.athlete1.name}</h3>
            </div>
            <div className="text-3xl font-bold">{calculateTotal('athlete1')}</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <PointButton 
              label="Yuko (1pt)" 
              count={scores.athlete1.yuko}
              icon={<ChevronUp className="h-4 w-4" />}
              onAdd={() => addPoint('athlete1', 'yuko')}
              onRemove={() => removePoint('athlete1', 'yuko')}
              disabled={!isActive}
            />
            
            <PointButton 
              label="Wazari (2pts)" 
              count={scores.athlete1.wazari}
              icon={<ChevronUp className="h-4 w-4" />}
              iconCount={2}
              onAdd={() => addPoint('athlete1', 'wazari')}
              onRemove={() => removePoint('athlete1', 'wazari')}
              disabled={!isActive}
            />
            
            <PointButton 
              label="Ippon (4pts)" 
              count={scores.athlete1.ippon}
              icon={<ChevronsUp className="h-4 w-4" />}
              onAdd={() => addPoint('athlete1', 'ippon')}
              onRemove={() => removePoint('athlete1', 'ippon')}
              disabled={!isActive}
            />
          </div>
        </div>
        
        <div className={`rounded-lg p-5 border-2 ${winner === 'athlete2' ? 'border-blue-500 bg-blue-500/5' : 'border-muted'}`}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <h3 className="font-medium text-lg">{match.athlete2.name}</h3>
            </div>
            <div className="text-3xl font-bold">{calculateTotal('athlete2')}</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <PointButton 
              label="Yuko (1pt)" 
              count={scores.athlete2.yuko}
              icon={<ChevronUp className="h-4 w-4" />}
              onAdd={() => addPoint('athlete2', 'yuko')}
              onRemove={() => removePoint('athlete2', 'yuko')}
              disabled={!isActive}
            />
            
            <PointButton 
              label="Wazari (2pts)" 
              count={scores.athlete2.wazari}
              icon={<ChevronUp className="h-4 w-4" />}
              iconCount={2}
              onAdd={() => addPoint('athlete2', 'wazari')}
              onRemove={() => removePoint('athlete2', 'wazari')}
              disabled={!isActive}
            />
            
            <PointButton 
              label="Ippon (4pts)" 
              count={scores.athlete2.ippon}
              icon={<ChevronsUp className="h-4 w-4" />}
              onAdd={() => addPoint('athlete2', 'ippon')}
              onRemove={() => removePoint('athlete2', 'ippon')}
              disabled={!isActive}
            />
          </div>
        </div>
      </div>
      
      {winner && (
        <div className="mt-6 p-4 rounded-lg border border-primary bg-primary/5 flex items-center gap-3">
          <Award className="h-5 w-5 text-primary" />
          <span className="font-medium">
            Vencedor: {winner === 'athlete1' ? match.athlete1.name : match.athlete2.name} ({calculateTotal(winner)} pontos)
          </span>
        </div>
      )}
    </div>
  );
}

interface PointButtonProps {
  label: string;
  count: number;
  icon: React.ReactNode;
  iconCount?: number;
  onAdd: () => void;
  onRemove: () => void;
  disabled?: boolean;
}

function PointButton({ label, count, icon, iconCount = 1, onAdd, onRemove, disabled }: PointButtonProps) {
  return (
    <div className="flex flex-col items-center">
      <Button 
        variant="outline" 
        className="w-full mb-1 h-12 flex flex-col items-center justify-center bg-background"
        onClick={onAdd}
        disabled={disabled}
      >
        <div className="flex gap-0.5">
          {Array.from({ length: iconCount }).map((_, i) => (
            <span key={i}>{icon}</span>
          ))}
        </div>
        <span className="text-xs">{label}</span>
      </Button>
      
      <div className="flex items-center gap-2 mt-1">
        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6"
          onClick={onRemove}
          disabled={disabled || count <= 0}
        >
          <span className="text-xs">-</span>
        </Button>
        
        <div className="bg-background/50 border rounded-full h-8 w-8 flex items-center justify-center font-semibold">
          {count}
        </div>
        
        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6"
          onClick={onAdd}
          disabled={disabled}
        >
          <span className="text-xs">+</span>
        </Button>
      </div>
    </div>
  );
}
