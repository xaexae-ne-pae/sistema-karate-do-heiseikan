
import React, { useEffect, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const BackgroundImage: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const [theme] = useLocalStorage<'dark' | 'light'>('karate-theme', 'dark');
  
  useEffect(() => {
    const img = new Image();
    img.src = "https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2072&auto=format&fit=crop";
    img.onload = () => setLoaded(true);
  }, []);

  return (
    <>
      {/* Background base */}
      <div className="fixed inset-0 z-[-2] bg-karate-black dark:bg-karate-black light:bg-white">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-karate-pattern opacity-5"></div>
      </div>
      
      {/* Background image with opacity */}
      <div 
        className={`fixed inset-0 z-[-1] opacity-0 transition-opacity duration-1000 ease-out ${loaded ? (theme === 'dark' ? 'opacity-40' : 'opacity-20') : ''}`}
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2072&auto=format&fit=crop)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      >
        {/* Gradient overlay - different for light and dark modes */}
        {theme === 'dark' ? (
          <div className="absolute inset-0 bg-gradient-to-r from-karate-black/70 to-transparent"></div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 to-white/60"></div>
        )}
      </div>
    </>
  );
};

export default BackgroundImage;
