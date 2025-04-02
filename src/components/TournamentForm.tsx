
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { DialogFooter } from "@/components/ui/dialog";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Tournament, TournamentFormData, TournamentStatus } from "@/types/tournament";
import { saveTournament } from "@/services/tournamentService";

interface TournamentFormProps {
  initialData?: Partial<Tournament>;
  onSuccess: (formData: Tournament) => void;
}

// Extracted form handler functions
const useFormHandlers = (
  initialData: Partial<Tournament> | undefined,
  onSuccess: (formData: Tournament) => void
) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    initialData?.date ? new Date(initialData.date) : undefined
  );
  
  const [formData, setFormData] = useState<TournamentFormData & { status?: TournamentStatus }>({
    name: initialData?.name || "",
    location: initialData?.location || "",
    description: initialData?.description || "",
    status: initialData?.status || "upcoming",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleStatusChange = (value: TournamentStatus) => {
    setFormData(prev => ({
      ...prev,
      status: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma data para o torneio.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Using our mock API service
      const savedTournament = await saveTournament({
        ...formData,
        date: format(date, "dd/MM/yyyy"),
        id: initialData?.id || Math.floor(Math.random() * 10000),
        status: formData.status || "upcoming",
        categoriesCount: initialData?.categoriesCount || 0,
        athletesCount: initialData?.athletesCount || 0,
      });
      
      toast({
        title: initialData?.id ? "Torneio atualizado" : "Torneio criado",
        description: initialData?.id 
          ? `As informações do torneio ${formData.name} foram atualizadas com sucesso.`
          : `O torneio ${formData.name} foi criado com sucesso.`
      });
      
      onSuccess(savedTournament);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar as informações do torneio.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    date,
    setDate,
    formData,
    isSubmitting,
    handleChange,
    handleStatusChange,
    handleSubmit
  };
};

export function TournamentForm({ initialData, onSuccess }: TournamentFormProps) {
  const {
    date,
    setDate,
    formData,
    isSubmitting,
    handleChange,
    handleStatusChange,
    handleSubmit
  } = useFormHandlers(initialData, onSuccess);

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Torneio</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ex: Campeonato Regional de Karatê 2025"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Data do Evento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : <span>Selecione uma data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Local</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Ex: Ginásio Municipal"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => handleStatusChange(value as TournamentStatus)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">Próximo</SelectItem>
              <SelectItem value="active">Em Andamento</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Informações adicionais sobre o torneio..."
            value={formData.description}
            onChange={handleChange}
            className="min-h-[80px]"
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting 
            ? 'Salvando...' 
            : initialData?.id ? 'Salvar alterações' : 'Criar torneio'}
        </Button>
      </DialogFooter>
    </form>
  );
}
