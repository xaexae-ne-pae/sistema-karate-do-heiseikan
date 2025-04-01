
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Trophy, Users, Clock, MapPin, Search, Filter, Flag, PlusCircle, ChevronRight, X } from "lucide-react";
import { TournamentForm } from "@/components/TournamentForm";
import { TournamentCard } from "@/components/TournamentCard";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  categories: string[];
  status: "active" | "upcoming" | "closed";
  participants: number;
}

type TournamentStatus = "upcoming" | "active" | "completed";

interface Tournament {
  id: number;
  name: string;
  date: string;
  location: string;
  status: TournamentStatus;
  categoriesCount: number;
  athletesCount: number;
}

const Inscriptions = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<"events" | "tournaments">("events");
  
  // Dados de exemplo para os eventos
  const events: Event[] = [
    {
      id: "evt1",
      title: "Campeonato Estadual de Karatê",
      date: "15/10/2023",
      location: "Ginásio Municipal",
      categories: ["Kata", "Kumite -60kg", "Kumite -75kg", "Kumite +75kg"],
      status: "active",
      participants: 87
    },
    {
      id: "evt2",
      title: "Copa Shotokan",
      date: "22/11/2023",
      location: "Dojo Central",
      categories: ["Kata", "Kumite Equipes", "Kata Equipes"],
      status: "active",
      participants: 64
    },
    {
      id: "evt3",
      title: "Torneio Regional de Karatê",
      date: "10/12/2023",
      location: "Centro Esportivo",
      categories: ["Kata Júnior", "Kumite Júnior", "Kumite Senior"],
      status: "upcoming",
      participants: 42
    },
    {
      id: "evt4",
      title: "Campeonato Nacional",
      date: "05/08/2023",
      location: "Estádio Nacional",
      categories: ["Todas as categorias"],
      status: "closed",
      participants: 156
    },
    {
      id: "evt5",
      title: "Torneio Escolar",
      date: "12/07/2023",
      location: "Colégio São Paulo",
      categories: ["Kata Infantil", "Kumite Infantil"],
      status: "closed",
      participants: 38
    }
  ];

  // Dados de exemplo para os torneios
  const tournaments: Tournament[] = [
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
  ];

  const filteredEvents = events.filter(event => {
    if (activeTab === "active") return event.status === "active";
    if (activeTab === "upcoming") return event.status === "upcoming";
    if (activeTab === "closed") return event.status === "closed";
    return true;
  });

  // Filtra torneios de acordo com o status e a busca
  const filterTournaments = (status: TournamentStatus) =>
    tournaments.filter(
      (tournament) =>
        tournament.status === status &&
        (tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tournament.location.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const activeTournaments = filterTournaments("active");
  const pastTournaments = filterTournaments("completed");
  const upcomingTournaments = filterTournaments("upcoming");

  const getStatusBadge = (status: "active" | "upcoming" | "closed") => {
    if (status === "active") return <Badge className="bg-green-500">Inscrições Abertas</Badge>;
    if (status === "upcoming") return <Badge className="bg-blue-500">Em Breve</Badge>;
    if (status === "closed") return <Badge variant="secondary">Encerrado</Badge>;
    return null;
  };

  const handleChangeSection = (section: "events" | "tournaments") => {
    setActiveSection(section);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b bg-background/95 px-8 py-4 backdrop-blur">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Inscrições</h1>
            <p className="text-muted-foreground">Gerenciar inscrições em torneios e eventos</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => handleChangeSection("events")}
              className={activeSection === "events" ? "bg-primary/10" : ""}
            >
              Eventos
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleChangeSection("tournaments")}
              className={activeSection === "tournaments" ? "bg-primary/10" : ""}
            >
              Torneios
            </Button>
            <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
              <Trophy className="h-4 w-4" />
              <span>{activeSection === "events" ? "Novo Evento" : "Novo Torneio"}</span>
            </Button>
          </div>
        </header>
        
        <main className="px-8 py-6">
          {activeSection === "events" && (
            <Tabs defaultValue="active" className="space-y-6" onValueChange={setActiveTab}>
              <div className="flex items-center justify-between">
                <TabsList className="grid grid-cols-3 w-[400px]">
                  <TabsTrigger value="active">Ativos</TabsTrigger>
                  <TabsTrigger value="upcoming">Em Breve</TabsTrigger>
                  <TabsTrigger value="closed">Encerrados</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="active" className="space-y-0 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                  
                  {filteredEvents.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                      <Trophy className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                      <h3 className="text-lg font-medium">Nenhum evento ativo no momento</h3>
                      <p className="text-muted-foreground mt-1 max-w-md">
                        Não há eventos com inscrições abertas atualmente. Confira os eventos futuros.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="upcoming" className="space-y-0 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                  
                  {filteredEvents.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                      <Calendar className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                      <h3 className="text-lg font-medium">Nenhum evento agendado</h3>
                      <p className="text-muted-foreground mt-1 max-w-md">
                        Não há eventos agendados para o futuro. Confira novamente em breve.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="closed" className="space-y-0 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                  
                  {filteredEvents.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                      <Clock className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                      <h3 className="text-lg font-medium">Nenhum evento encerrado</h3>
                      <p className="text-muted-foreground mt-1 max-w-md">
                        Não há registros de eventos anteriores no sistema.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
          
          {activeSection === "tournaments" && (
            <>
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
              </div>

              <TournamentSection
                title="Torneios Ativos"
                description="Próximos eventos e competições em andamento"
                tournaments={activeTournaments}
                onAddTournament={() => setIsDialogOpen(true)}
                searchQuery={searchQuery}
                showCalendar
              />

              <TournamentSection
                title="Torneios Anteriores"
                description="Histórico de competições realizadas"
                tournaments={pastTournaments}
                searchQuery={searchQuery}
                showCalendar={false}
              />

              <TournamentSection
                title="Torneios Futuros"
                description="Próximos torneios agendados"
                tournaments={upcomingTournaments}
                searchQuery={searchQuery}
                showCalendar={false}
              />
            </>
          )}
        </main>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{activeSection === "events" ? "Novo Evento" : "Novo Torneio"}</DialogTitle>
            <DialogDescription>
              Preencha as informações {activeSection === "events" ? "do evento" : "do torneio"} para criar um novo.
            </DialogDescription>
          </DialogHeader>

          {activeSection === "tournaments" && (
            <TournamentForm onSuccess={() => setIsDialogOpen(false)} />
          )}
          {/* We would add an EventForm component here if it existed */}
          {activeSection === "events" && (
            <div className="py-4 text-center text-muted-foreground">
              Formulário de criação de eventos em desenvolvimento.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface EventCardProps {
  event: Event;
}

function EventCard({ event }: EventCardProps) {
  const isActive = event.status === "active";
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:translate-y-[-3px] hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{event.title}</CardTitle>
          {getStatusBadge(event.status)}
        </div>
        <CardDescription>
          <div className="flex items-center mt-1 gap-1">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center mt-1 gap-1">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{event.location}</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div>
          <h4 className="text-sm font-medium mb-2">Categorias:</h4>
          <div className="flex flex-wrap gap-1">
            {event.categories.map((category, index) => (
              <Badge key={index} variant="outline" className="bg-primary/5">
                {category}
              </Badge>
            ))}
          </div>
        </div>
        <div className="mt-3 flex items-center">
          <Users className="h-4 w-4 text-muted-foreground mr-1.5" />
          <span className="text-sm text-muted-foreground">{event.participants} participantes</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          variant={isActive ? "default" : "secondary"}
          disabled={!isActive}
        >
          {isActive ? "Inscrever-se" : event.status === "upcoming" ? "Aguardando abertura" : "Inscrições encerradas"}
        </Button>
      </CardFooter>
    </Card>
  );
}

const TournamentSection = ({
  title,
  description,
  tournaments,
  onAddTournament,
  searchQuery,
  showCalendar,
}: {
  title: string;
  description: string;
  tournaments: Tournament[];
  onAddTournament?: () => void;
  searchQuery: string;
  showCalendar: boolean;
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
      {showCalendar && (
        <Button variant="outline" size="sm" className="gap-1">
          <Calendar className="h-4 w-4" />
          <span>Calendário</span>
        </Button>
      )}
    </div>

    {tournaments.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tournaments.map((tournament) => (
          <TournamentCard key={tournament.id} tournament={tournament} />
        ))}
        {onAddTournament && (
          <Button
            variant="outline"
            className="h-[220px] border-dashed flex flex-col gap-4 hover:border-primary hover:bg-primary/5"
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

function getStatusBadge(status: "active" | "upcoming" | "closed") {
  if (status === "active") return <Badge className="bg-green-500">Inscrições Abertas</Badge>;
  if (status === "upcoming") return <Badge className="bg-blue-500">Em Breve</Badge>;
  if (status === "closed") return <Badge variant="secondary">Encerrado</Badge>;
  return null;
}

export default Inscriptions;
