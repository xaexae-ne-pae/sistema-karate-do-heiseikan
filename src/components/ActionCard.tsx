
import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  to: string;
}

export function ActionCard({ icon: Icon, title, description, to }: ActionCardProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="w-full rounded-lg border bg-card text-left overflow-hidden shadow-sm transition-all duration-300 hover:translate-x-1 hover:shadow-md hover:shadow-primary/10 dark:bg-card/90"
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="rounded-full p-3 bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="text-2xl font-light opacity-20 mt-0.5">→</div>
        </div>
      </div>
    </button>
  );
}
