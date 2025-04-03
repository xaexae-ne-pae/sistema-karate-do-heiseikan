
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface TournamentHeaderProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export const TournamentHeader = ({ 
  title, 
  description, 
  children 
}: TournamentHeaderProps) => {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b bg-background/95 px-8 py-4 backdrop-blur">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">
          {description}
        </p>
      </div>
      
      {children && (
        <div className="flex items-center gap-3">
          {children}
        </div>
      )}
    </header>
  );
};
