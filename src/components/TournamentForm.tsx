
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { DialogFooter } from "@/components/ui/dialog";
import { CalendarIcon, Clock } from "lucide-react";
import { format, isToday, isPast, isFuture } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Tournament, TournamentFormData } from "@/types/tournament";
import { saveTournament } from "@/services/tournamentService";

interface TournamentFormProps {
  initialData?: Partial<Tournament>;
  onSuccess: (formData: Tournament) => void;
}

// Helper function to determine tournament status based on date and time
const determineTournamentStatus = (date: Date, timeString: string): "upcoming" | "active" | "completed" => {
  const now = new Date();
  
  if (isPast(date) && !isToday(date)) {
    return "completed";
  }
  
  if (isToday(date)) {
    // Convert time string to hours and minutes
    const [hours, minutes] = timeString.split(':').map(Number);
    
    // Create date objects for comparison
    const tournamentDateTime = new Date(date);
    tournamentDateTime.setHours(hours, minutes, 0, 0);
    
    const currentTime = new Date();
    
    // If tournament date is today and current time is past the tournament time
    if (currentTime >= tournamentDateTime) {
      return "active";
    }
  }
  
  return "upcoming";
};

// Extracted form handler functions
const useFormHandlers = (
  initialData: Partial<Tournament> | undefined,
  onSuccess: (formData: Tournament) => void
) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    initialData?.date ? new Date(initialData.date.split('/').reverse().join('-')) : undefined
  );
  
  const [time, setTime] = useState<string>(initialData?.time || "08:00");
  
  const [formData, setFormData] = useState<TournamentFormData>({
    name: initialData?.name || "",
    location: initialData?.location || "",
    description: initialData?.description || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
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
      // Determine tournament status based on date and time
      const status = initialData?.status === "completed" 
        ? "completed" 
        : determineTournamentStatus(date, time);
      
      // Using our mock API service
      const savedTournament = await saveTournament({
        ...formData,
        date: format(date, "dd/MM/yyyy"),
        time,
        id: initialData?.id || Math.floor(Math.random() * 10000),
        status,
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
    time,
    formData,
    isSubmitting,
    handleChange,
    handleTimeChange,
    handleSubmit
  };
};

export function TournamentForm({ initialData, onSuccess }: TournamentFormProps) {
  const {
    date,
    setDate,
    time,
    formData,
    isSubmitting,
    handleChange,
    handleTimeChange,
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
              <PopoverContent className="w-auto p-0" align="start">
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
            <Label htmlFor="time">Hora do Evento</Label>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <Input
                id="time"
                name="time"
                type="time"
                value={time}
                onChange={handleTimeChange}
                className="flex-1"
                required
              />
            </div>
          </div>
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
