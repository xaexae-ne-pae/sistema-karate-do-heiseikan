
import { BarChart2, Calendar, Home, LogOut, Settings, Shield, Users } from "lucide-react";
import { DashboardLogo } from "./DashboardLogo";
import { SidebarLink } from "./SidebarLink";
import { ThemeToggle } from "./ThemeToggle";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useNavigate } from "react-router-dom";

export function Sidebar() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Clear any saved credentials
    localStorage.removeItem('karate_username');
    localStorage.removeItem('karate_password');
    localStorage.removeItem('karate_remember');
    
    // Redirect to login page
    navigate('/');
  };

  return (
    <div className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-sidebar border-border">
      <div className="flex shrink-0 items-center gap-2 px-6 py-5">
        <DashboardLogo />
      </div>
      
      <div className="flex flex-1 flex-col px-4 py-4 gap-1">
        <SidebarLink icon={Home} label="Visão Geral" to="/dashboard" />
        <SidebarLink icon={Users} label="Atletas" to="/atletas" />
        <SidebarLink icon={Shield} label="Categorias" to="/categorias" />
        <SidebarLink icon={Calendar} label="Torneios" to="/torneios" />
        <SidebarLink icon={BarChart2} label="Pontuação" to="/pontuacao" />
        <SidebarLink icon={BarChart2} label="Resultados" to="/resultados" />
        <SidebarLink icon={Settings} label="Configurações" to="/configuracoes" />
      </div>

      <div className="border-t border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarFallback className="bg-primary/10 text-foreground">A</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">admin</span>
              <span className="text-xs text-muted-foreground">Administrador</span>
            </div>
          </div>
          <ThemeToggle iconOnly />
        </div>
        
        <Separator className="my-4" />
        
        <button 
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 text-foreground/70" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
