
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Trophy, 
  Medal, 
  BarChart2, 
  FileText, 
  Download, 
  Filter, 
  Info, 
  X 
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MatchResultCard } from "@/components/MatchResultCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Results = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("rankings");
  
  // Dados fictícios para demonstração
  const rankingsData = [
    { position: 1, name: "João Silva", category: "Kumite Masculino -75kg", points: 250, medals: { gold: 2, silver: 1, bronze: 0 } },
    { position: 2, name: "Carlos Eduardo", category: "Kumite Masculino -75kg", points: 210, medals: { gold: 1, silver: 2, bronze: 1 } },
    { position: 3, name: "Fernando Costa", category: "Kumite Masculino -75kg", points: 180, medals: { gold: 1, silver: 1, bronze: 1 } },
    { position: 4, name: "Pedro Santos", category: "Kumite Masculino -67kg", points: 175, medals: { gold: 1, silver: 1, bronze: 0 } },
    { position: 5, name: "Ana Pereira", category: "Kata Feminino", points: 165, medals: { gold: 1, silver: 0, bronze: 2 } },
    { position: 6, name: "Lúcia Fernandes", category: "Kata Feminino", points: 145, medals: { gold: 0, silver: 2, bronze: 1 } },
    { position: 7, name: "Mariana Alves", category: "Kata Feminino", points: 130, medals: { gold: 0, silver: 1, bronze: 3 } },
    { position: 8, name: "Carla Mendes", category: "Kata Feminino", points: 120, medals: { gold: 0, silver: 1, bronze: 2 } },
  ];
  
  const matchesData = [
    { 
      id: 1, 
      category: "Kumite Masculino -75kg", 
      date: "15/03/2025", 
      tournament: "Copa Shotokan - 2ª Etapa",
      athlete1: { name: "João Silva", color: "red", score: 8 },
      athlete2: { name: "Carlos Eduardo", color: "blue", score: 6 },
      winner: "athlete1" as "athlete1" | "athlete2"
    },
    { 
      id: 2, 
      category: "Kata Feminino", 
      date: "15/03/2025", 
      tournament: "Copa Shotokan - 2ª Etapa",
      athlete1: { name: "Ana Pereira", color: "red", score: 26.5 },
      athlete2: { name: "Lúcia Fernandes", color: "blue", score: 25.8 },
      winner: "athlete1" as "athlete1" | "athlete2"
    },
    { 
      id: 3, 
      category: "Kumite Masculino -67kg", 
      date: "20/01/2025", 
      tournament: "Copa Shotokan - 1ª Etapa",
      athlete1: { name: "Pedro Santos", color: "red", score: 5 },
      athlete2: { name: "Fernando Costa", color: "blue", score: 7 },
      winner: "athlete2" as "athlete1" | "athlete2"
    },
    { 
      id: 4, 
      category: "Kata Feminino", 
      date: "20/01/2025", 
      tournament: "Copa Shotokan - 1ª Etapa",
      athlete1: { name: "Mariana Alves", color: "red", score: 24.7 },
      athlete2: { name: "Carla Mendes", color: "blue", score: 25.2 },
      winner: "athlete2" as "athlete1" | "athlete2"
    },
  ];

  const filteredRankings = rankingsData.filter(athlete => 
    athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    athlete.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredMatches = matchesData.filter(match => 
    match.athlete1.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    match.athlete2.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    match.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    match.tournament.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b bg-background/95 px-8 py-4 backdrop-blur">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Resultados</h1>
            <p className="text-muted-foreground">Visualizar rankings e histórico de lutas</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              <span>Exportar</span>
            </Button>
          </div>
        </header>
        
        <main className="px-8 py-6">
          <Tabs defaultValue="rankings" className="space-y-6" onValueChange={setActiveTab}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <TabsList>
                <TabsTrigger value="rankings" className="gap-2">
                  <Trophy className="h-4 w-4" />
                  <span>Rankings</span>
                </TabsTrigger>
                <TabsTrigger value="matches" className="gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Histórico</span>
                </TabsTrigger>
                <TabsTrigger value="statistics" className="gap-2">
                  <BarChart2 className="h-4 w-4" />
                  <span>Estatísticas</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="flex gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder={activeTab === "rankings" ? "Buscar atletas..." : "Buscar lutas..."}
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
                
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <TabsContent value="rankings" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px] text-center">Posição</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead className="w-[180px]">Categoria</TableHead>
                      <TableHead className="w-[100px] text-center">Pontos</TableHead>
                      <TableHead className="w-[150px] text-center">Medalhas</TableHead>
                      <TableHead className="w-[100px] text-right">Detalhes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRankings.length > 0 ? (
                      filteredRankings.map((athlete) => (
                        <TableRow key={athlete.position}>
                          <TableCell className="text-center font-medium">
                            {athlete.position <= 3 ? (
                              <div className="inline-flex items-center justify-center">
                                <Medal className={`h-5 w-5 
                                  ${athlete.position === 1 ? 'text-yellow-500' : 
                                    athlete.position === 2 ? 'text-gray-400' : 
                                    'text-amber-700'}`} 
                                />
                              </div>
                            ) : (
                              athlete.position
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{athlete.name}</TableCell>
                          <TableCell>{athlete.category}</TableCell>
                          <TableCell className="text-center font-semibold">{athlete.points}</TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-2">
                              <Badge className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">
                                {athlete.medals.gold}
                              </Badge>
                              <Badge className="bg-gray-300/40 text-gray-700 hover:bg-gray-300/50">
                                {athlete.medals.silver}
                              </Badge>
                              <Badge className="bg-amber-700/20 text-amber-800 hover:bg-amber-700/30">
                                {athlete.medals.bronze}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost">
                              <Info className="h-4 w-4" />
                              <span className="sr-only">Detalhes</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          {searchQuery 
                            ? `Nenhum atleta encontrado para "${searchQuery}"`
                            : "Nenhum atleta ranqueado"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="matches" className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Histórico de Lutas</h2>
                
                {filteredMatches.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMatches.map(match => (
                      <MatchResultCard key={match.id} match={match} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 border rounded-lg">
                    <p className="text-muted-foreground">
                      {searchQuery 
                        ? `Nenhuma luta encontrada para "${searchQuery}"`
                        : "Nenhuma luta registrada"}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="statistics" className="space-y-6">
              <div className="text-center py-16 border rounded-lg">
                <div className="mx-auto flex flex-col items-center">
                  <BarChart2 className="h-10 w-10 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium mb-1">Estatísticas em breve</h3>
                  <p className="text-muted-foreground mb-4 max-w-md">
                    Estamos trabalhando para trazer estatísticas detalhadas sobre os atletas e competições.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Results;
