
import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description
}: ConfirmationDialogProps) {
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Generate a random 4-digit code when the dialog opens
  useEffect(() => {
    if (isOpen) {
      const newCode = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedCode(newCode);
      setCode("");
      setIsSubmitting(false);
      toast({
        title: "Código de autenticação",
        description: `Seu código é: ${newCode}`,
      });
    }
  }, [isOpen, toast]);
  
  const handleConfirm = () => {
    if (code === generatedCode) {
      setIsSubmitting(true);
      onConfirm();
    } else {
      toast({
        title: "Código incorreto",
        description: "O código digitado não corresponde ao código gerado.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4 py-4">
          <p className="text-sm text-center">
            Digite o código de 4 dígitos que foi exibido para autenticar esta ação:
          </p>
          
          <InputOTP maxLength={4} value={code} onChange={setCode}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={code.length < 4 || isSubmitting}>
            {isSubmitting ? "Confirmando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
