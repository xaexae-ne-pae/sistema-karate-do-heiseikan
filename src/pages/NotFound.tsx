
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    document.body.classList.add('dashboard-active');
    
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    return () => {
      document.body.classList.remove('dashboard-active');
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <div className="text-center max-w-md mx-auto p-6 animate-scale-in">
        <h1 className="text-7xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-xl font-semibold mb-2">Página não encontrada</h2>
        <p className="text-muted-foreground mb-6">
          Desculpe, a página que você está procurando não foi encontrada ou foi movida.
        </p>
        <Link to="/">
          <Button className="gap-2">
            <span>Voltar à página inicial</span>
            <span className="text-lg leading-none">→</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
