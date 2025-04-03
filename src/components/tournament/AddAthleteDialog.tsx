
import { AthleteForm } from "@/components/AthleteForm";
import { Athlete } from "@/types/athlete";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddAthleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (athlete: Athlete) => void;
  title?: string;
  description?: string;
}

export const AddAthleteDialog = ({ 
  open, 
  onOpenChange, 
  onSuccess,
  title = "Adicionar Atleta ao Torneio",
  description = "Preencha os dados do atleta para adicionar a este torneio."
}: AddAthleteDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <AthleteForm 
          onSuccess={onSuccess}
          initialData={null}
          onAthleteUpdated={() => {}}
        />
      </DialogContent>
    </Dialog>
  );
};
