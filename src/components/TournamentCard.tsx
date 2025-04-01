
import { Calendar, MapPin, Users, Tag, ChevronRight, CheckCircle, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
}

export function TournamentCard({ tournament, onFinishTournament, isAdmin }: TournamentCardProps) {
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
  
  const statusDetails = getStatusDetails(tournament.status);

  const handleFinishTournament = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFinishTournament) {
      onFinishTournament(tournament.id);
    }
  };

  return (
    <div className="glass-card rounded-xl p-5 shadow-lg bg-gradient-to-br from-card to-card/80 border border-border/30 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 z-0"></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <Badge variant={statusDetails.variant as any} className="capitalize flex items-center px-3 py-1">
          {statusDetails.icon}
          <span>{statusDetails.label}</span>
        </Badge>
        
        {isAdmin && tournament.status === 'active' && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleFinishTournament}
            className="text-xs bg-background/80 hover:bg-background"
          >
            Finalizar
          </Button>
        )}
      </div>
      
      <h3 className="font-semibold text-lg mb-4 line-clamp-2 relative z-10">{tournament.name}</h3>
      
      <div className="space-y-3 mb-5 relative z-10">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className={`h-4 w-4 ${statusDetails.color}`} />
          <span>{tournament.date}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{tournament.location}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm mb-5 relative z-10 bg-muted/30 p-2 rounded-lg">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{tournament.categoriesCount} categorias</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{tournament.athletesCount} atletas</span>
        </div>
      </div>
      
      <div className="relative z-10">
        <Link to={`/inscricoes?tournament=${tournament.id}`}>
          <Button variant="ghost" className="w-full justify-between hover:bg-primary/10">
            <span>{tournament.status === 'completed' ? 'Ver Resultados' : 'Gerenciar'}</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
