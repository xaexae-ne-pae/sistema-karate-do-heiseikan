
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
      <div className="fixed inset-0 z-[-2] bg-karate-black">
        <div className="absolute inset-0 bg-karate-pattern opacity-5"></div>
      </div>
      <div 
        className={`fixed inset-0 z-[-1] opacity-0 transition-opacity duration-1000 ease-out ${loaded ? 'opacity-40' : ''}`}
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2072&auto=format&fit=crop)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-karate-black/70 to-transparent"></div>
      </div>
    </>
  );
};

export default BackgroundImage;
