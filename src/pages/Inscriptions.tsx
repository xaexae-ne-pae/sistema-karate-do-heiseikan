
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
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
import { 
  Calendar, 
  Users, 
  Clock, 
  MapPin
} from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  categories: string[];
  status: "active" | "upcoming" | "closed";
  participants: number;
}

const Inscriptions = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");
  
  useEffect(() => {
    const savedUsername = localStorage.getItem('karate_username') || '';
    const savedRole = localStorage.getItem('karate_role') || 'user';
    setUsername(savedUsername);
    setUserRole(savedRole);
  }, []);

  const isAdmin = userRole === 'admin' || username === 'Francivaldo';
  
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

  const filteredEvents = events.filter(event => {
    if (activeTab === "active") return event.status === "active";
    if (activeTab === "upcoming") return event.status === "upcoming";
    if (activeTab === "closed") return event.status === "closed";
    return true;
  });

  const getStatusBadge = (status: "active" | "upcoming" | "closed") => {
    if (status === "active") return <Badge className="bg-green-500">Inscrições Abertas</Badge>;
    if (status === "upcoming") return <Badge className="bg-blue-500">Em Breve</Badge>;
    if (status === "closed") return <Badge variant="secondary">Encerrado</Badge>;
    return null;
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b bg-background/95 px-8 py-4 backdrop-blur">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Inscrições</h1>
            <p className="text-muted-foreground">Gerenciar inscrições em eventos</p>
          </div>
          
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
                <span>Novo Evento</span>
              </Button>
            )}
          </div>
        </header>
        
        <main className="px-8 py-6">
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
                    <Clock className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
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
        </main>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Novo Evento</DialogTitle>
            <DialogDescription>
              Preencha as informações do evento para criar um novo.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-center text-muted-foreground">
            Formulário de criação de eventos em desenvolvimento.
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface EventCardProps {
  event: Event;
}

function EventCard({ event }: EventCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:translate-y-[-3px] hover:shadow-md border-border/30 bg-gradient-to-br from-card to-card/80 flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{event.title}</CardTitle>
          {event.status === "active" ? (
            <Badge className="bg-green-500">Inscrições Abertas</Badge>
          ) : event.status === "upcoming" ? (
            <Badge className="bg-blue-500">Em Breve</Badge>
          ) : (
            <Badge variant="secondary">Encerrado</Badge>
          )}
        </div>
        <CardDescription>
          <div className="flex items-center mt-1 gap-1">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center mt-1 gap-1">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{event.location}</span>
          </div>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2 flex-grow">
        <div>
          <h4 className="text-sm font-medium mb-1">Categorias:</h4>
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
          variant={event.status === "active" ? "default" : "secondary"}
          disabled={event.status !== "active"}
        >
          {event.status === "active" ? "Inscrever-se" : event.status === "upcoming" ? "Aguardando abertura" : "Inscrições encerradas"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Inscriptions;
