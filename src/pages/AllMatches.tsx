
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Search, ChevronLeft, Filter, X } from "lucide-react";

// Interfaces
interface Athlete {
  name: string;
  color: string;
}

interface Match {
  id: number;
  category: string;
  time: string;
  mat: string;
  athlete1: Athlete;
  athlete2: Athlete;
}

const AllMatches = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Dados fictícios para demonstração - podemos expandir estes dados
  const matchesData: Match[] = [
    { 
      id: 1, 
      category: "Male Kumite -75kg", 
      time: "10:30 AM", 
      mat: "Mat 1",
      athlete1: { name: "John D.", color: "red" },
      athlete2: { name: "Mike S.", color: "blue" }
    },
    { 
      id: 2, 
      category: "Female Kata", 
      time: "11:15 AM", 
      mat: "Mat 2",
      athlete1: { name: "Anna K.", color: "red" },
      athlete2: { name: "Sarah L.", color: "blue" }
    },
    { 
      id: 3, 
      category: "Junior Kumite", 
      time: "12:00 PM", 
      mat: "Mat 3",
      athlete1: { name: "David R.", color: "red" },
      athlete2: { name: "Alex M.", color: "blue" }
    },
    { 
      id: 4, 
      category: "Senior Kata", 
      time: "13:30 PM", 
      mat: "Mat 1",
      athlete1: { name: "Robert T.", color: "red" },
      athlete2: { name: "James P.", color: "blue" }
    },
    { 
      id: 5, 
      category: "Female Kumite -60kg", 
      time: "14:15 PM", 
      mat: "Mat 2",
      athlete1: { name: "Lisa M.", color: "red" },
      athlete2: { name: "Karen J.", color: "blue" }
    },
    { 
      id: 6, 
      category: "Male Team Kata", 
      time: "15:00 PM", 
      mat: "Mat 3",
      athlete1: { name: "Team Alpha", color: "red" },
      athlete2: { name: "Team Beta", color: "blue" }
    },
  ];

  // Filtrar lutas com base na pesquisa
  const filteredMatches = matchesData.filter(match => 
    match.athlete1.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    match.athlete2.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    match.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    match.time.toLowerCase().includes(searchQuery.toLowerCase()) ||
    match.mat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b bg-background/95 px-8 py-4 backdrop-blur">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Todas as Lutas</h1>
            <p className="text-muted-foreground">Visualize todas as lutas programadas</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2" onClick={() => window.history.back()}>
              <ChevronLeft className="h-4 w-4" />
              <span>Voltar</span>
            </Button>
          </div>
        </header>
        
        <main className="px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar lutas..."
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
          
          <div className="rounded-md border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Categoria</TableHead>
                  <TableHead>Atleta 1</TableHead>
                  <TableHead>Atleta 2</TableHead>
                  <TableHead className="w-[120px]">Hora</TableHead>
                  <TableHead className="w-[120px]">Tatame</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMatches.length > 0 ? (
                  filteredMatches.map((match) => (
                    <TableRow key={match.id} className="hover:bg-muted/80">
                      <TableCell className="font-medium">{match.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          {match.athlete1.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          {match.athlete2.name}
                        </div>
                      </TableCell>
                      <TableCell>{match.time}</TableCell>
                      <TableCell>{match.mat}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      {searchQuery 
                        ? `Nenhuma luta encontrada para "${searchQuery}"`
                        : "Nenhuma luta programada"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AllMatches;
