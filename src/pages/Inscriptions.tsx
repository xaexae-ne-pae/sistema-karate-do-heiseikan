
import { useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { motion } from "framer-motion";

const Inscriptions = () => {
  // Remove dashboard styling for this page
  useEffect(() => {
    document.body.classList.remove('dashboard-active');
    
    return () => {
      // Restore dashboard styling when leaving
      const currentPath = window.location.pathname;
      if (currentPath !== '/inscricoes') {
        document.body.classList.add('dashboard-active');
      }
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-karate-black">
      <Sidebar />
      
      <div className="flex-1 ml-64 flex items-center justify-center">
        <motion.div 
          className="text-center px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-karate-white mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            Inscrições
          </motion.h1>
          
          <motion.div
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h2 className="text-xl md:text-3xl font-medium text-karate-white/70 mb-8">
              Abertura em breve
            </h2>
            
            <div className="w-24 h-1 bg-karate-red mx-auto my-8"></div>
            
            <p className="text-karate-white/60 max-w-xl mx-auto">
              As inscrições para o próximo torneio estarão disponíveis em breve. 
              Fique atento às nossas redes sociais para mais informações.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Inscriptions;
