
import { useState } from "react";
import { Calendar, MapPin, Users, Tag, ChevronRight, CheckCircle, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";

interface TournamentCardProps {
  tournament: {
    id: number;
    name: string;
    date: string;
    location: string;
    status: 'upcoming' | 'active' | 'completed';
    categoriesCount: number;
    athletesCount: number;
  };
  onFinishTournament?: (id: number) => void;
  isAdmin: boolean;
  isJudge?: boolean;
}

export function TournamentCard({ tournament, onFinishTournament, isAdmin, isJudge }: TournamentCardProps) {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  
  const getStatusDetails = (status: string) => {
    const statusMap = {
      'upcoming': { 
        label: 'Próximo', 
        variant: 'outline', 
        color: 'text-blue-500',
        icon: <Timer className="h-4 w-4 mr-1" /> 
      },
      'active': { 
        label: 'Em Andamento', 
        variant: 'default', 
        color: 'text-primary',
        icon: <Timer className="h-4 w-4 mr-1 text-green-500" />
      },
      'completed': { 
        label: 'Concluído', 
        variant: 'secondary', 
        color: 'text-muted-foreground',
        icon: <CheckCircle className="h-4 w-4 mr-1" />
      }
    };
    
    return statusMap[status as keyof typeof statusMap] || { label: status, variant: 'outline', color: '', icon: null };
  };
  
  const handleFinishTournamentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmFinish = () => {
    if (onFinishTournament) {
      onFinishTournament(tournament.id);
    }
    setIsConfirmDialogOpen(false);
  };

  // Check if user can finish tournaments (admin or judge)
  const canFinishTournament = isAdmin || isJudge;

  return (
    <div className="glass-card rounded-xl p-5 shadow-lg bg-gradient-to-br from-card to-card/80 border border-border/30 hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col min-h-[280px]">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 z-0"></div>
      
      <div className="flex justify-between items-start mb-2 relative z-10">
        {tournament.status === 'active' ? (
          <Badge className="bg-green-500 px-3 py-1 text-white capitalize flex items-center">
            Em Andamento
          </Badge>
        ) : tournament.status === 'upcoming' ? (
          <Badge variant="outline" className="px-3 py-1 capitalize flex items-center">
            <Timer className="h-4 w-4 mr-1" />
            <span>Próximo</span>
          </Badge>
        ) : (
          <Badge variant="secondary" className="px-3 py-1 capitalize flex items-center">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span>Concluído</span>
          </Badge>
        )}
        
        {canFinishTournament && tournament.status === 'active' && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleFinishTournamentClick}
            className="text-xs bg-background/80 hover:bg-background"
          >
            Finalizar
          </Button>
        )}
      </div>
      
      <h3 className="font-semibold text-lg mb-2 line-clamp-2 relative z-10">{tournament.name}</h3>
      
      <div className="space-y-2 mb-4 relative z-10">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-primary" />
          <span>{tournament.date}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{tournament.location}</span>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex flex-wrap gap-2 mb-3 relative z-10">
          {tournament.categoriesCount > 0 && (
            <Badge variant="outline" className="bg-primary/5">
              Kata
            </Badge>
          )}
          {tournament.categoriesCount > 1 && (
            <Badge variant="outline" className="bg-primary/5">
              Kumite
            </Badge>
          )}
          {tournament.categoriesCount > 2 && (
            <Badge variant="outline" className="bg-primary/5">
              Equipes
            </Badge>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm mb-4 relative z-10 bg-muted/30 p-2 rounded-lg">
        <div className="flex items-center gap-1">
          <Tag className="h-3 w-3 text-muted-foreground" />
          <span className="text-muted-foreground text-xs">{tournament.categoriesCount} categorias</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Users className="h-3 w-3 text-muted-foreground" />
          <span className="text-muted-foreground text-xs">{tournament.athletesCount} atletas</span>
        </div>
      </div>
      
      <div className="relative z-10 mt-auto">
        <Link to={`/torneios/${tournament.id}`}>
          <Button variant="default" className="w-full justify-between bg-primary hover:bg-primary/90">
            <span>{tournament.status === 'active' ? 'Entrar no Torneio' : tournament.status === 'completed' ? 'Ver Resultados' : 'Detalhes'}</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <ConfirmationDialog 
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleConfirmFinish}
        title="Finalizar Torneio"
        description={`Tem certeza que deseja finalizar o torneio "${tournament.name}"? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
}
