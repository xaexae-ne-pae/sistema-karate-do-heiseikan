
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Inscriptions from "./pages/Inscriptions";
import PaymentPage from "./pages/PaymentPage";
import Tournaments from "./pages/Tournaments";
import TournamentDetails from "./pages/TournamentDetails";
import TournamentAthletes from "./pages/TournamentAthletes";
import TournamentCategories from "./pages/TournamentCategories";
import TournamentResults from "./pages/TournamentResults";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Categories from "./pages/Categories";

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
          <Route path="/inscricoes" element={
            <ProtectedRoute>
              <Inscriptions />
            </ProtectedRoute>
          } />
          <Route path="/inscricoes/pagamento" element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          } />
          <Route path="/torneios" element={
            <ProtectedRoute>
              <Tournaments />
            </ProtectedRoute>
          } />
          <Route path="/torneios/:id" element={
            <ProtectedRoute>
              <TournamentDetails />
            </ProtectedRoute>
          } />
          
          {/* Tournament Specific Routes */}
          <Route path="/torneios/:id/atletas" element={
            <ProtectedRoute>
              <TournamentAthletes />
            </ProtectedRoute>
          } />
          <Route path="/torneios/:id/categorias" element={
            <ProtectedRoute>
              <TournamentCategories />
            </ProtectedRoute>
          } />
          <Route path="/torneios/:id/resultados" element={
            <ProtectedRoute>
              <TournamentResults />
            </ProtectedRoute>
          } />
          
          {/* Redirect old routes to tournaments */}
          <Route path="/atletas" element={<Navigate to="/torneios" replace />} />
          <Route path="/categorias" element={<Navigate to="/torneios" replace />} />
          <Route path="/resultados" element={<Navigate to="/torneios" replace />} />
          
          <Route path="/configuracoes" element={
            <ProtectedRoute>
              <Settings />
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
