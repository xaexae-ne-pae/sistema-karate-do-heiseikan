
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  to: string;
}

export function ActionCard({ icon: Icon, title, description, to }: ActionCardProps) {
  return (
    <Card className="mb-4 transition-all duration-300 hover:translate-x-1 hover:shadow-md hover:shadow-primary/10 dark:bg-card/90">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 rounded-full p-2 text-primary">
            <Icon className="h-4 w-4" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium text-sm mb-1">{title}</h3>
            <p className="text-xs text-muted-foreground mb-3">{description}</p>
            
            <Link to={to}>
              <Button variant="ghost" className="px-0 h-6 hover:bg-transparent hover:text-primary text-muted-foreground text-xs">
                <span>Acessar</span>
                <span className="ml-1 text-base leading-none">→</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
