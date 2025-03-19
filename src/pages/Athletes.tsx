
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Search, Filter, UserPlus, X } from "lucide-react";
import { AthleteForm } from "@/components/AthleteForm";
import { AthletesList } from "@/components/AthletesList";

const Athletes = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingAthlete, setEditingAthlete] = useState<any | null>(null);

  const handleOpenDialog = (athlete = null) => {
    setEditingAthlete(athlete);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingAthlete(null);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b bg-background/95 px-8 py-4 backdrop-blur">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Atletas</h1>
            <p className="text-muted-foreground">Gerenciar cadastro de atletas</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <UserPlus className="h-4 w-4" />
              <span>Novo Atleta</span>
            </Button>
          </div>
        </header>
        
        <main className="px-8 py-6">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar atletas..."
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
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Filter className="h-3.5 w-3.5" />
                <span>Filtrar</span>
              </Button>
            </div>
          </div>
          
          <AthletesList onEdit={handleOpenDialog} searchQuery={searchQuery} />
        </main>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingAthlete ? 'Editar Atleta' : 'Novo Atleta'}</DialogTitle>
            <DialogDescription>
              {editingAthlete 
                ? 'Edite as informações do atleta nos campos abaixo.'
                : 'Preencha as informações do novo atleta nos campos abaixo.'}
            </DialogDescription>
          </DialogHeader>
          
          <AthleteForm 
            initialData={editingAthlete} 
            onSuccess={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Athletes;
