
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface Athlete {
  id: number;
  name: string;
  age: number;
  weight: number;
  height?: number;
  category: string;
  status: boolean;
  belt: string;
  dojo?: string;
  notes?: string;
}

interface AthleteFormProps {
  initialData?: Athlete | null;
  onSuccess: (athlete: Athlete) => void;
  onAthleteUpdated?: () => void;
}

export function AthleteForm({ initialData, onSuccess, onAthleteUpdated }: AthleteFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    age: initialData?.age || "",
    weight: initialData?.weight || "",
    height: initialData?.height || "",
    category: initialData?.category || "",
    status: initialData?.status !== false,
    belt: initialData?.belt || "",
    notes: initialData?.notes || "",
    dojo: initialData?.dojo || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (value: boolean) => {
    setFormData(prev => ({
      ...prev,
      status: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Carregar atletas existentes
      const storedAthletes = localStorage.getItem('karate_athletes');
      let athletes = storedAthletes ? JSON.parse(storedAthletes) : [];
      
      // Converter valores para números onde necessário
      const athleteData: Athlete = {
        id: initialData?.id || Date.now(),
        name: formData.name,
        age: Number(formData.age),
        weight: Number(formData.weight),
        height: Number(formData.height),
        category: formData.category,
        status: formData.status,
        belt: formData.belt,
        dojo: formData.dojo,
        notes: formData.notes,
      };
      
      if (initialData) {
        // Editar atleta existente
        athletes = athletes.map((athlete: Athlete) => 
          athlete.id === initialData.id ? athleteData : athlete
        );
      } else {
        // Adicionar novo atleta
        athletes.push(athleteData);
      }
      
      // Atualizar localStorage
      localStorage.setItem('karate_athletes', JSON.stringify(athletes));
      
      // Notificar através do toast
      toast({
        title: initialData ? "Atleta atualizado" : "Atleta cadastrado",
        description: initialData 
          ? `As informações de ${formData.name} foram atualizadas com sucesso.`
          : `${formData.name} foi adicionado à lista de atletas.`
      });
      
      // Notificar componente pai que houve atualização
      if (onAthleteUpdated) {
        onAthleteUpdated();
      }
      
      // Fechar o formulário
      onSuccess(athleteData);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar as informações do atleta.",
        variant: "destructive"
      });
      console.error("Erro ao salvar atleta:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Idade</Label>
              <Input
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="height">Altura (cm)</Label>
            <Input
              id="height"
              name="height"
              type="number"
              value={formData.height}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="belt">Faixa</Label>
            <Select
              value={formData.belt}
              onValueChange={(value) => handleSelectChange("belt", value)}
              required
            >
              <SelectTrigger id="belt">
                <SelectValue placeholder="Selecione a faixa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="white">Branca</SelectItem>
                <SelectItem value="yellow">Amarela</SelectItem>
                <SelectItem value="red">Vermelha</SelectItem>
                <SelectItem value="orange">Laranja</SelectItem>
                <SelectItem value="green">Verde</SelectItem>
                <SelectItem value="purple">Roxa</SelectItem>
                <SelectItem value="brown">Marrom</SelectItem>
                <SelectItem value="black">Preta</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleSelectChange("category", value)}
              required
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Kata Individual">Kata Individual</SelectItem>
                <SelectItem value="Kata Equipe">Kata Equipe</SelectItem>
                <SelectItem value="Kumite -60kg">Kumite -60kg</SelectItem>
                <SelectItem value="Kumite -67kg">Kumite -67kg</SelectItem>
                <SelectItem value="Kumite -75kg">Kumite -75kg</SelectItem>
                <SelectItem value="Kumite -84kg">Kumite -84kg</SelectItem>
                <SelectItem value="Kumite +84kg">Kumite +84kg</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dojo">Dojo</Label>
            <Select
              value={formData.dojo}
              onValueChange={(value) => handleSelectChange("dojo", value)}
              required
            >
              <SelectTrigger id="dojo">
                <SelectValue placeholder="Selecione o dojo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="do-heiseikan">DÓ-HEISEIKAN</SelectItem>
                <SelectItem value="shotokan">Shotokan Karate</SelectItem>
                <SelectItem value="goju-ryu">Goju-Ryu</SelectItem>
                <SelectItem value="wado-ryu">Wado-Ryu</SelectItem>
                <SelectItem value="shito-ryu">Shito-Ryu</SelectItem>
                <SelectItem value="kyokushin">Kyokushin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center justify-start gap-4">
          <Switch
            id="status"
            checked={formData.status}
            onCheckedChange={handleSwitchChange}
          />
          <Label htmlFor="status">Atleta Ativo</Label>
        </div>
        
        <Separator className="my-1" />
        
        <div className="space-y-2">
          <Label htmlFor="notes">Observações</Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Informações adicionais sobre o atleta..."
            value={formData.notes}
            onChange={handleChange}
            className="min-h-[80px]"
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting 
            ? 'Salvando...' 
            : initialData ? 'Salvar alterações' : 'Cadastrar atleta'}
        </Button>
      </DialogFooter>
    </form>
  );
}
