
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tournament } from "@/types/tournament";
import { Flag, Calendar, Shield, Users, ChevronRight, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TournamentListProps {
  activeTournaments: Tournament[];
  upcomingTournaments: Tournament[];
  completedTournaments: Tournament[];
  onAddTournament: () => void;
  onFinalizeTournament: (tournament: Tournament) => void;
  isLoading: boolean;
}

export const TournamentList = ({
  activeTournaments,
  upcomingTournaments,
  completedTournaments,
  onAddTournament,
  onFinalizeTournament,
  isLoading
}: TournamentListProps) => {
  const navigate = useNavigate();

  const handleEnterTournament = (id: number) => {
    navigate(`/torneios/${id}`);
  };

  // Render the tournament card
  const renderTournamentCard = (tournament: Tournament) => (
    <div 
      key={tournament.id}
      className="rounded-lg border border-border/40 bg-card/30 overflow-hidden hover:border-primary/20 hover:bg-card/40 transition-colors cursor-pointer"
      onClick={() => handleEnterTournament(tournament.id)}
    >
      <div className="p-5 border-b border-border/20">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{tournament.name}</h3>
          {tournament.status === 'active' && (
            <Badge className="bg-green-500 text-white capitalize">
              Em Andamento
            </Badge>
          )}
          {tournament.status === 'upcoming' && (
            <Badge variant="outline" className="capitalize">
              Próximo
            </Badge>
          )}
          {tournament.status === 'completed' && (
            <Badge variant="secondary" className="capitalize">
              Concluído
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <Calendar className="h-4 w-4" />
          <span>{tournament.date}</span>
        </div>
      </div>
      
      <div className="p-5">
        {tournament.location && (
          <div className="text-sm text-muted-foreground mb-4">
            {tournament.location}
          </div>
        )}
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{tournament.categoriesCount || 0} categorias</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{tournament.athletesCount || 0} atletas</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            className="w-full justify-between"
            onClick={() => handleEnterTournament(tournament.id)}
          >
            <span>Entrar no Torneio</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          {tournament.status === 'active' && (
            <Button 
              variant="outline" 
              className="px-3"
              onClick={(e) => {
                e.stopPropagation();
                onFinalizeTournament(tournament);
              }}
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const renderAddTournamentCard = () => (
    <button 
      className="rounded-lg border border-dashed border-border flex flex-col items-center justify-center p-12 text-center cursor-pointer hover:border-primary/40 hover:bg-background/30 transition-colors"
      onClick={onAddTournament}
    >
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <ChevronRight className="h-6 w-6 text-primary" />
      </div>
      <h3 className="font-medium mb-1">Adicionar Torneio</h3>
      <p className="text-sm text-muted-foreground">
        Crie um novo torneio para gerenciar
      </p>
    </button>
  );

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[1, 2].map((_, i) => (
          <div 
            key={i} 
            className="h-64 rounded-lg border border-border/40 bg-card/30 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Flag className="h-5 w-5 text-red-500" />
          <h2 className="text-xl font-semibold">Torneios Ativos</h2>
        </div>
        <p className="text-muted-foreground mb-5">
          Eventos em andamento que você pode gerenciar
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTournaments.map(tournament => renderTournamentCard(tournament))}
          {renderAddTournamentCard()}
        </div>
      </div>
      
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Flag className="h-5 w-5 text-gray-500" />
          <h2 className="text-xl font-semibold">Torneios Futuros</h2>
        </div>
        <p className="text-muted-foreground mb-5">
          Próximos torneios agendados
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingTournaments.map(tournament => renderTournamentCard(tournament))}
          {upcomingTournaments.length < 3 && renderAddTournamentCard()}
        </div>
      </div>
      
      {/* Completed Tournaments Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Flag className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-semibold">Torneios Finalizados</h2>
        </div>
        <p className="text-muted-foreground mb-5">
          Torneios que já foram concluídos
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedTournaments.map(tournament => renderTournamentCard(tournament))}
        </div>
      </div>
    </>
  );
};
