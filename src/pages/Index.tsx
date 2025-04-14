
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundImage from '@/components/BackgroundImage';
import LoginForm from '@/components/LoginForm';
import Logo from '@/components/Logo';

const Index = () => {
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    
    // Check if user is logged in
    const username = localStorage.getItem('karate_username');
    if (username) {
      navigate('/dashboard', { replace: true });
    }
    
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <BackgroundImage />
      
      <header className="pt-6 px-6 lg:px-10">
        <Logo className={`opacity-0 ${mounted ? 'animate-fade-in' : ''}`} />
      </header>
      
      <main className="flex-1 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* Coluna esquerda - decorativa */}
          <div className="hidden lg:flex items-center justify-center p-10">
            <div 
              className={`text-center opacity-0 ${mounted ? 'animate-fade-in' : ''}`}
              style={{ animationDelay: '600ms' }}
            >
              <h1 className="text-5xl font-bold text-karate-white mb-4 tracking-tight leading-tight">
                Karate <span className="text-karate-red">Shotokan</span>
              </h1>
              <p className="text-karate-white/80 text-xl max-w-md mx-auto leading-relaxed mb-4">
                O caminho para a excelência começa com o primeiro passo. Entre e continue sua jornada.
              </p>
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-karate-white/40 to-transparent"></div>
                <div className="h-1 w-1 rounded-full bg-karate-red"></div>
                <div className="h-px w-40 bg-gradient-to-r from-transparent via-karate-white/40 to-transparent"></div>
                <div className="h-1 w-1 rounded-full bg-karate-red"></div>
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-karate-white/40 to-transparent"></div>
              </div>
            </div>
          </div>
          
          {/* Coluna direita - formulário de login */}
          <div className="flex items-center justify-center p-6 lg:p-10">
            <div className="w-full max-w-md">
              <div 
                className={`text-center mb-8 lg:hidden opacity-0 ${mounted ? 'animate-fade-in' : ''}`}
                style={{ animationDelay: '600ms' }}
              >
                <h1 className="text-3xl font-bold text-karate-white mb-3 tracking-tight leading-tight">
                  Karate <span className="text-karate-red">Shotokan</span>
                </h1>
                <p className="text-karate-white/70 max-w-sm mx-auto leading-relaxed mb-4">
                  O caminho para a excelência começa com o primeiro passo. Entre e continue sua jornada.
                </p>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="h-px w-10 bg-gradient-to-r from-transparent via-karate-white/40 to-transparent"></div>
                  <div className="h-1 w-1 rounded-full bg-karate-red"></div>
                  <div className="h-px w-28 bg-gradient-to-r from-transparent via-karate-white/40 to-transparent"></div>
                  <div className="h-1 w-1 rounded-full bg-karate-red"></div>
                  <div className="h-px w-10 bg-gradient-to-r from-transparent via-karate-white/40 to-transparent"></div>
                </div>
              </div>
              
              <LoginForm 
                className={`opacity-0 ${mounted ? 'animate-fade-in' : ''}`}
                style={{ animationDelay: '800ms' }}
              />
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-4 px-6">
        <div 
          className={`text-center text-sm text-karate-white/50 opacity-0 ${mounted ? 'animate-fade-in' : ''}`}
          style={{ animationDelay: '1000ms' }}
        >
          &copy; {new Date().getFullYear()} Associação de Karate Shotokan. Todos os direitos reservados. Desenvolvido por <a href="https://alevirdev.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: '#CCCCCC', textDecoration: 'underline' }}>Alevir Coelho Neto</a>.
        </div>
      </footer>
    </div>
  );
};

export default Index;
