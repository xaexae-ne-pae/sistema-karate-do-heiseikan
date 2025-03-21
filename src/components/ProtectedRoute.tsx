
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is authenticated by looking for saved credentials
    // This is a simple implementation. In a real app, you would validate the token on the server
    const isAuthenticated = localStorage.getItem('karate_username') !== null;
    
    if (!isAuthenticated) {
      // Redirect to login page if not authenticated
      navigate('/', { replace: true });
    }
  }, [navigate]);

  return <>{children}</>;
}
