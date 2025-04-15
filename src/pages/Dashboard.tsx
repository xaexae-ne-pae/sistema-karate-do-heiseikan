
import { Sidebar } from "@/components/Sidebar";
import BackgroundImage from "@/components/BackgroundImage";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <BackgroundImage />
      <Sidebar />
      
      <div className="flex-1 ml-0 md:ml-64 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-karate-white mb-4">
            Página em Desenvolvimento
          </h1>
          <p className="text-karate-white/70">
            Esta página está sendo atualizada. Volte em breve!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
