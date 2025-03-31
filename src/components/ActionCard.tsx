
import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  to: string;
  onClick?: () => void;
}

export function ActionCard({ icon: Icon, title, description, to, onClick }: ActionCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(to);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="w-full rounded-lg border bg-card text-left overflow-hidden shadow-sm transition-all duration-300 hover:translate-x-1 hover:shadow-md hover:shadow-primary/10 dark:bg-card/90"
    >
      <div className="p-6">
        <div className="flex items-start gap-5">
          <div className="rounded-full p-4 bg-primary/10 text-primary">
            <Icon className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-medium mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="text-3xl font-light opacity-20 mt-0.5">→</div>
        </div>
      </div>
    </button>
  );
}
