
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Calendar, 
  Trophy, 
  Search, 
  Flag, 
  PlusCircle, 
  X
} from "lucide-react";
import { TournamentForm } from "@/components/TournamentForm";
import { TournamentCard } from "@/components/TournamentCard";
import { useToast } from "@/hooks/use-toast";
import { Tournament } from "@/types/tournament";
import { saveTournament } from "@/services/tournamentService";

const Tournaments = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");
  const [tournaments, setTournaments] = useState<Tournament[]>([
    {
      id: 1,
      name: "Campeonato Regional de Karatê 2025",
      date: "15/05/2025",
      location: "Ginásio Municipal",
      status: "upcoming",
      categoriesCount: 12,
      athletesCount: 98,
    },
    {
      id: 2,
      name: "Copa Shotokan - 3ª Etapa",
      date: "28/06/2025",
      location: "Centro Esportivo Água Rasa",
      status: "active",
      categoriesCount: 8,
      athletesCount: 64,
    },
    {
      id: 3,
      name: "Copa Shotokan - 2ª Etapa",
      date: "15/03/2025",
      location: "Centro Esportivo Água Rasa",
      status: "completed",
      categoriesCount: 8,
      athletesCount: 72,
    },
    {
      id: 4,
      name: "Campeonato Estadual 2024",
      date: "10/11/2024",
      location: "Ginásio do Ibirapuera",
      status: "completed",
      categoriesCount: 15,
      athletesCount: 120,
    },
    {
      id: 5,
      name: "Copa Shotokan - 1ª Etapa",
      date: "20/01/2025",
      location: "Centro Esportivo Água Rasa",
      status: "completed",
      categoriesCount: 8,
      athletesCount: 68,
    },
  ]);
  
  useEffect(() => {
    const savedUsername = localStorage.getItem('karate_username') || '';
    const savedRole = localStorage.getItem('karate_role') || 'user';
    setUsername(savedUsername);
    setUserRole(savedRole);
  }, []);

  const isAdmin = userRole === 'admin' || username === 'Francivaldo';
  const isJudge = userRole === 'judge';
  
  const filterTournaments = (status: "upcoming" | "active" | "completed") =>
    tournaments.filter(
      (tournament) =>
        tournament.status === status &&
        (tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tournament.location.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const activeTournaments = filterTournaments("active");
  const pastTournaments = filterTournaments("completed");
  const upcomingTournaments = filterTournaments("upcoming");

  const handleFinishTournament = (id: number) => {
    setTournaments(prevTournaments => 
      prevTournaments.map(tournament => 
        tournament.id === id ? {...tournament, status: 'completed'} : tournament
      )
    );

    toast({
      title: "Torneio finalizado",
      description: "O torneio foi finalizado com sucesso e movido para a seção de encerrados.",
    });
  };

  const handleTournamentSuccess = async (formData: Tournament) => {
    try {
      setIsDialogOpen(false);
      
      const savedTournament = await saveTournament({
        ...formData,
        status: "upcoming",
        categoriesCount: 0,
        athletesCount: 0
      });
      
      setTournaments(prev => [savedTournament, ...prev]);
      
      toast({
        title: "Torneio criado",
        description: "O novo torneio foi criado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o torneio.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b bg-background/95 px-8 py-4 backdrop-blur">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Torneios</h1>
            <p className="text-muted-foreground">Gerenciar torneios e competições</p>
          </div>
          
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
                <Trophy className="h-4 w-4" />
                <span>Novo Torneio</span>
              </Button>
            )}
          </div>
        </header>
        
        <main className="px-8 py-6">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar torneios..."
                className="w-full pl-9 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <X
                  className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer"
                  onClick={() => setSearchQuery("")}
                />
              )}
            </div>
            
            <Button variant="outline" size="sm" className="gap-1">
              <Calendar className="h-4 w-4" />
              <span>Calendário</span>
            </Button>
          </div>

          <TournamentSection
            title="Torneios Ativos"
            description="Eventos em andamento que você pode gerenciar"
            tournaments={activeTournaments}
            onAddTournament={isAdmin ? () => setIsDialogOpen(true) : undefined}
            searchQuery={searchQuery}
            onFinishTournament={isAdmin || isJudge ? handleFinishTournament : undefined}
            isAdmin={isAdmin}
            isJudge={isJudge}
          />

          <TournamentSection
            title="Torneios Encerrados"
            description="Histórico de competições realizadas"
            tournaments={pastTournaments}
            searchQuery={searchQuery}
            isAdmin={isAdmin}
            isJudge={isJudge}
          />

          <TournamentSection
            title="Torneios Futuros"
            description="Próximos torneios agendados"
            tournaments={upcomingTournaments}
            searchQuery={searchQuery}
            isAdmin={isAdmin}
            isJudge={isJudge}
          />
        </main>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Novo Torneio</DialogTitle>
            <DialogDescription>
              Preencha as informações do torneio para criar um novo.
            </DialogDescription>
          </DialogHeader>
          <TournamentForm onSuccess={handleTournamentSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const TournamentSection = ({
  title,
  description,
  tournaments,
  onAddTournament,
  searchQuery,
  onFinishTournament,
  isAdmin = false,
  isJudge = false,
}: {
  title: string;
  description: string;
  tournaments: Tournament[];
  onAddTournament?: () => void;
  searchQuery: string;
  onFinishTournament?: (id: number) => void;
  isAdmin?: boolean;
  isJudge?: boolean;
}) => (
  <div className="mb-10">
    <div className="flex items-center justify-between mb-5">
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Flag className="h-5 w-5 text-primary" />
          {title}
        </h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>

    {tournaments.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tournaments.map((tournament) => (
          <TournamentCard 
            key={tournament.id} 
            tournament={tournament} 
            onFinishTournament={onFinishTournament}
            isAdmin={isAdmin}
            isJudge={isJudge}
          />
        ))}
        {onAddTournament && (
          <Button
            variant="outline"
            className="min-h-[280px] border-dashed flex flex-col gap-4 hover:border-primary hover:bg-primary/5"
            onClick={onAddTournament}
          >
            <PlusCircle className="h-10 w-10 text-muted-foreground" />
            <span className="text-muted-foreground">Adicionar Torneio</span>
          </Button>
        )}
      </div>
    ) : (
      <div className="text-center py-8 border rounded-lg">
        <p className="text-muted-foreground">
          {searchQuery
            ? `Nenhum torneio encontrado para "${searchQuery}"`
            : "Nenhum torneio registrado."}
        </p>
      </div>
    )}
  </div>
);

export default Tournaments;
