
import React, { useEffect, useState } from 'react';

const BackgroundImage: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    const img = new Image();
    img.src = "https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2072&auto=format&fit=crop";
    img.onload = () => setLoaded(true);
  }, []);

  return (
    <>
      {/* Background base */}
      <div className="fixed inset-0 z-[-2] bg-karate-black dark:bg-karate-black light:bg-gray-100">
        {/* Padrão de fundo */}
        <div className="absolute inset-0 bg-karate-pattern opacity-5 dark:opacity-5 light:opacity-10"></div>
      </div>
      
      {/* Imagem de fundo com opacidade diferente por tema */}
      <div 
        className={`fixed inset-0 z-[-1] opacity-0 transition-opacity duration-1000 ease-out ${loaded ? 'dark:opacity-40 light:opacity-5' : ''}`}
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2072&auto=format&fit=crop)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      >
        {/* Gradiente sobreposto diferente por tema */}
        <div className="absolute inset-0 bg-gradient-to-r from-karate-black/70 to-transparent dark:from-karate-black/70 light:from-white/90"></div>
      </div>
    </>
  );
};

export default BackgroundImage;
