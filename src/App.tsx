
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Athletes from "./pages/Athletes";
import Categories from "./pages/Categories";
import Scoring from "./pages/Scoring";
import Results from "./pages/Results";
import Inscriptions from "./pages/Inscriptions";
import AllMatches from "./pages/AllMatches";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

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
          <Route path="/todas-lutas" element={
            <ProtectedRoute>
              <AllMatches />
            </ProtectedRoute>
          } />
          <Route path="/configuracoes" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          
          {/* Redirect old tournament path to inscriptions */}
          <Route path="/torneios" element={<Navigate to="/inscricoes" replace />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
