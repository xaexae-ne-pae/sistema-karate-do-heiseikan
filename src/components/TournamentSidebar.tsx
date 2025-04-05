
import { Home, BarChart2, Medal, Shield, Users, Trophy, LogOut } from "lucide-react";
import Logo from "./Logo";
import { SidebarLink } from "./SidebarLink";
import { ThemeToggle } from "./ThemeToggle";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export function TournamentSidebar() {
  const navigate = useNavigate();
  const { id: tournamentId } = useParams<{ id: string }>();
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");
  
  useEffect(() => {
    const savedUsername = localStorage.getItem('karate_username') || '';
    const savedRole = localStorage.getItem('karate_role') || 'user';
    setUsername(savedUsername);
    setUserRole(savedRole);
  }, []);
  
  const handleLogout = () => {
    // Clear any saved credentials
    localStorage.removeItem('karate_username');
    localStorage.removeItem('karate_password');
    localStorage.removeItem('karate_remember');
    localStorage.removeItem('karate_role');
    
    // Redirect to login page
    navigate('/');
  };

  // Get first letter of username for avatar
  const avatarInitial = username ? username.charAt(0).toUpperCase() : '';
  const isAdmin = userRole === 'admin' || username === 'Francivaldo';

  return (
    <div className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-sidebar-background border-border">
      <div className="flex shrink-0 items-center p-5 border-b border-border/30">
        <Logo variant="dashboard" />
      </div>
      
      <div className="flex flex-1 flex-col px-4 py-4 gap-1">
        <SidebarLink icon={Home} label="Visão Geral" to={`/torneios/${tournamentId}`} />
        <SidebarLink icon={Users} label="Atletas" to={`/torneios/${tournamentId}/atletas`} />
        <SidebarLink icon={Shield} label="Categorias" to={`/torneios/${tournamentId}/categorias`} />
        <SidebarLink icon={BarChart2} label="Pontuação" to={`/torneios/${tournamentId}/pontuacao`} />
        <SidebarLink icon={Medal} label="Resultados" to={`/torneios/${tournamentId}/resultados`} />
        <SidebarLink icon={Trophy} label="Voltar para Torneios" to="/torneios" />
      </div>

      <div className="border-t border-border/30 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 shrink-0 transition-opacity duration-200 hover:opacity-90">
              <AvatarFallback className="bg-primary/10 text-foreground transition-colors duration-200 hover:bg-primary/20">{avatarInitial}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{username}</span>
              <span className="text-xs text-muted-foreground">
                {isAdmin ? 'Administrador' : 'Jurado'}
              </span>
            </div>
          </div>
          <ThemeToggle iconOnly />
        </div>
        
        <Separator className="my-4" />
        
        <button 
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-all duration-200 hover:bg-sidebar-accent hover:text-foreground hover:translate-x-0.5"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 text-foreground/70 transition-transform duration-200 group-hover:scale-105" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
