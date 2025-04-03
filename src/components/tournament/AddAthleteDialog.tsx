
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
}

export const AddAthleteDialog = ({ 
  open, 
  onOpenChange, 
  onSuccess 
}: AddAthleteDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Adicionar Atleta ao Torneio</DialogTitle>
          <DialogDescription>
            Selecione um atleta para adicionar a este torneio.
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
