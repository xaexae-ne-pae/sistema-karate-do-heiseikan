
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

interface AthleteFormProps {
  initialData?: any;
  onSuccess: () => void;
}

export function AthleteForm({ initialData, onSuccess }: AthleteFormProps) {
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
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: initialData ? "Atleta atualizado" : "Atleta cadastrado",
        description: initialData 
          ? `As informações de ${formData.name} foram atualizadas com sucesso.`
          : `${formData.name} foi adicionado à lista de atletas.`
      });
      
      onSuccess();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar as informações do atleta.",
        variant: "destructive"
      });
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
            >
              <SelectTrigger id="belt">
                <SelectValue placeholder="Selecione a faixa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="white">Branca</SelectItem>
                <SelectItem value="yellow">Amarela</SelectItem>
                <SelectItem value="orange">Laranja</SelectItem>
                <SelectItem value="green">Verde</SelectItem>
                <SelectItem value="blue">Azul</SelectItem>
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
                <SelectItem value="kata-individual">Kata Individual</SelectItem>
                <SelectItem value="kata-team">Kata Equipe</SelectItem>
                <SelectItem value="kumite-under-60">Kumite -60kg</SelectItem>
                <SelectItem value="kumite-under-67">Kumite -67kg</SelectItem>
                <SelectItem value="kumite-under-75">Kumite -75kg</SelectItem>
                <SelectItem value="kumite-under-84">Kumite -84kg</SelectItem>
                <SelectItem value="kumite-above-84">Kumite +84kg</SelectItem>
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
