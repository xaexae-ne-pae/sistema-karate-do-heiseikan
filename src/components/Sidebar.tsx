
import { Home, LogOut, Settings, Shield, Users, Clipboard, Trophy, Menu, X } from "lucide-react";
import Logo from "./Logo";
import { SidebarLink } from "./SidebarLink";
import { ThemeToggle } from "./ThemeToggle";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export function Sidebar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button variant="outline" size="icon" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out bg-sidebar-background border-r border-border ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex shrink-0 items-center p-5 border-b border-border/30">
          <Logo variant="dashboard" />
        </div>
        
        <div className="flex flex-1 flex-col px-4 py-4 gap-2 overflow-y-auto">
          <div className="mb-6">
            <p className="px-3 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
              Menu Principal
            </p>
            <SidebarLink icon={Home} label="Visão Geral" to="/dashboard" />
            <SidebarLink icon={Trophy} label="Torneios" to="/torneios" />
            <SidebarLink icon={Clipboard} label="Inscrições" to="/inscricoes" />
            <SidebarLink icon={Settings} label="Configurações" to="/configuracoes" />
          </div>
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

      {/* Content margin adjustment for mobile */}
      <div className="md:hidden h-16"></div>
    </>
  );
}
