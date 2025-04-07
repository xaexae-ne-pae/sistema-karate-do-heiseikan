
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TournamentForm } from "@/components/TournamentForm";
import { Tournament } from "@/types/tournament";
import { useToast } from "@/hooks/use-toast";

interface AddTournamentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onTournamentAdded: (tournament: Tournament) => void;
}

export function AddTournamentDialog({ isOpen, onClose, onTournamentAdded }: AddTournamentDialogProps) {
  const { toast } = useToast();

  const handleSuccess = (tournament: Tournament) => {
    onTournamentAdded(tournament);
    onClose();
    toast({
      title: "Torneio adicionado",
      description: `O torneio "${tournament.name}" foi adicionado com sucesso.`
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Torneio</DialogTitle>
          <DialogDescription>
            Preencha as informações para criar um novo torneio. O status será determinado automaticamente com base na data e hora.
          </DialogDescription>
        </DialogHeader>
        <TournamentForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
