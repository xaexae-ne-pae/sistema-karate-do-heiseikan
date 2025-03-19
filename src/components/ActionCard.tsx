
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  to: string;
}

export function ActionCard({ icon: Icon, title, description, to }: ActionCardProps) {
  return (
    <div className="glass-card rounded-lg p-5 mb-4 animate-scale-in hover-scale hover-glow transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 rounded-full p-2.5 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium text-base">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          
          <Link to={to}>
            <Button variant="ghost" className="px-0 hover:bg-transparent hover:text-primary text-muted-foreground">
              <span>Acessar</span>
              <span className="ml-1.5 text-lg leading-none">→</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
