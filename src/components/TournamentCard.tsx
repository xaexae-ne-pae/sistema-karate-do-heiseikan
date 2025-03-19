
import { Calendar, MapPin, Users, Tag, ChevronRight } from "lucide-react";
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
}

export function TournamentCard({ tournament }: TournamentCardProps) {
  const getStatusDetails = (status: string) => {
    const statusMap = {
      'upcoming': { label: 'Próximo', variant: 'outline', color: 'text-blue-500' },
      'active': { label: 'Em Andamento', variant: 'default', color: 'text-primary' },
      'completed': { label: 'Concluído', variant: 'secondary', color: 'text-muted-foreground' }
    };
    
    return statusMap[status as keyof typeof statusMap] || { label: status, variant: 'outline', color: '' };
  };
  
  const statusDetails = getStatusDetails(tournament.status);

  return (
    <div className="glass-card rounded-lg p-5 animate-scale-in hover-scale hover-glow transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <Badge variant={statusDetails.variant as any} className="capitalize">
          {statusDetails.label}
        </Badge>
      </div>
      
      <h3 className="font-semibold text-lg mb-3 line-clamp-2">{tournament.name}</h3>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className={`h-4 w-4 ${statusDetails.color}`} />
          <span>{tournament.date}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{tournament.location}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm mb-4">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{tournament.categoriesCount} categorias</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{tournament.athletesCount} atletas</span>
        </div>
      </div>
      
      <div>
        <Link to={`/torneios/${tournament.id}`}>
          <Button variant="ghost" className="w-full justify-between">
            <span>{tournament.status === 'completed' ? 'Ver Resultados' : 'Gerenciar'}</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
