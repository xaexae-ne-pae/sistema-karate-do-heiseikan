
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Athletes from "./pages/Athletes";
import Categories from "./pages/Categories";
import Tournaments from "./pages/Tournaments";
import Scoring from "./pages/Scoring";
import Results from "./pages/Results";
import Inscriptions from "./pages/Inscriptions";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/atletas" element={
            <ProtectedRoute>
              <Athletes />
            </ProtectedRoute>
          } />
          <Route path="/inscricoes" element={
            <ProtectedRoute>
              <Inscriptions />
            </ProtectedRoute>
          } />
          <Route path="/categorias" element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          } />
          <Route path="/torneios" element={
            <ProtectedRoute>
              <Tournaments />
            </ProtectedRoute>
          } />
          <Route path="/pontuacao" element={
            <ProtectedRoute>
              <Scoring />
            </ProtectedRoute>
          } />
          <Route path="/resultados" element={
            <ProtectedRoute>
              <Results />
            </ProtectedRoute>
          } />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
