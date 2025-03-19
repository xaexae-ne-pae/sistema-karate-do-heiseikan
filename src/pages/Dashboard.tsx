
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any saved credentials
    localStorage.removeItem('karate_username');
    localStorage.removeItem('karate_password');
    localStorage.removeItem('karate_remember');
    
    // Redirect to login page
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Karate Shotokan</h1>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut size={16} />
            Sair
          </Button>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-8 shadow-sm border border-gray-100">
          <p className="text-gray-600 text-center text-lg">
            Bem-vindo ao painel administrativo do Karate Shotokan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
