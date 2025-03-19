
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { User, Lock, ChevronRight, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
  className?: string;
  style?: React.CSSProperties;
}

const LoginForm: React.FC<LoginFormProps> = ({ className, style }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    remember: false
  });
  const { toast } = useToast();

  useEffect(() => {
    const savedUsername = localStorage.getItem('karate_username');
    const savedPassword = localStorage.getItem('karate_password');
    const savedRemember = localStorage.getItem('karate_remember') === 'true';
    
    if (savedRemember && savedUsername && savedPassword) {
      setCredentials({
        username: savedUsername,
        password: savedPassword,
        remember: savedRemember
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleCheckboxChange = (checked: boolean) => {
    setCredentials(prev => ({
      ...prev,
      remember: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (credentials.username === 'Francivaldo' && credentials.password === 'karate2025') {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (credentials.remember) {
        localStorage.setItem('karate_username', credentials.username);
        localStorage.setItem('karate_password', credentials.password);
        localStorage.setItem('karate_remember', 'true');
      } else {
        localStorage.removeItem('karate_username');
        localStorage.removeItem('karate_password');
        localStorage.removeItem('karate_remember');
      }
      
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo de volta ao Karate Shotokan"
      });
      
      navigate('/dashboard');
    } else {
      setError('Nome de usuário ou senha incorretos');
    }
    
    setLoading(false);
  };

  return (
    <div className={`glass-morphism p-8 rounded-xl max-w-md w-full mx-auto animate-scale-in ${className}`} style={style}>
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-karate-white mb-2 tracking-wide">Bem-vindo</h2>
        <p className="text-karate-white/60 text-sm">Entre para acessar sua conta</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm font-medium text-karate-white/80">
            Nome de usuário
          </Label>
          <div className="relative">
            <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focused === 'username' ? 'text-karate-red' : 'text-karate-white/50'}`}>
              <User size={18} />
            </div>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Nome de usuário"
              value={credentials.username}
              onChange={handleChange}
              onFocus={() => setFocused('username')}
              onBlur={() => setFocused(null)}
              className="bg-white/5 border-white/10 pl-10 h-12 text-karate-white placeholder:text-karate-white/30 focus-visible:border-karate-red focus-visible:bg-white/10 transition-all duration-300"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium text-karate-white/80">
              Senha
            </Label>
            <a href="#" className="text-xs text-karate-white/60 hover:text-karate-red transition-colors duration-200">
              Esqueceu a senha?
            </a>
          </div>
          <div className="relative">
            <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focused === 'password' ? 'text-karate-red' : 'text-karate-white/50'}`}>
              <Lock size={18} />
            </div>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={credentials.password}
              onChange={handleChange}
              onFocus={() => setFocused('password')}
              onBlur={() => setFocused(null)}
              className="bg-white/5 border-white/10 pl-10 pr-10 h-12 text-karate-white placeholder:text-karate-white/30 focus-visible:border-karate-red focus-visible:bg-white/10 transition-all duration-300"
              required
            />
            <button 
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-karate-white/50 hover:text-karate-red transition-colors duration-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="text-karate-red text-sm py-2 px-3 bg-karate-red/10 rounded-md border border-karate-red/20">
            {error}
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="remember" 
            checked={credentials.remember}
            onCheckedChange={handleCheckboxChange}
            className="data-[state=checked]:bg-karate-red data-[state=checked]:border-karate-red"
          />
          <label
            htmlFor="remember"
            className="text-sm font-medium leading-none text-karate-white/70 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Lembrar-me
          </label>
        </div>
        
        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-karate-red hover:bg-karate-red/90 text-white h-12 font-medium transition-all duration-300 group relative overflow-hidden shimmer"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {loading ? 'Entrando...' : 'Entrar'}
            <ChevronRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
