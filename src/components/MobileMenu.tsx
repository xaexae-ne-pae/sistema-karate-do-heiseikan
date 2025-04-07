
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";
import { NavLink } from "react-router-dom";

interface MobileMenuProps {
  links: {
    href: string;
    label: string;
    icon?: React.ReactNode;
  }[];
}

export function MobileMenu({ links }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="md:hidden fixed top-4 right-4 z-50 animate-fade-in">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full bg-background/80 backdrop-blur-sm border border-border/40 shadow-md hover:shadow-lg transition-all"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="left" 
          className="p-0 w-[280px] border-r bg-sidebar"
          showCloseButton={false}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-6 py-5 animate-fade-in">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center transition-colors duration-300">
                  <span className="text-white font-bold">K</span>
                </div>
                <h1 className="text-xl font-bold transition-colors duration-300">Karate Manager</h1>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-muted transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex flex-1 flex-col px-3 py-3 gap-1 overflow-auto">
              {links.map((link, index) => (
                <NavLink
                  key={index}
                  to={link.href}
                  onClick={handleLinkClick}
                  className={({ isActive }) => `
                    flex items-center gap-2 px-4 py-2.5 rounded-md font-medium text-sm
                    ${isActive ? 'bg-sidebar-accent text-foreground' : 'text-foreground/70 hover:text-foreground hover:bg-sidebar-accent/50'}
                    transition-colors duration-200
                  `}
                >
                  {link.icon}
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
