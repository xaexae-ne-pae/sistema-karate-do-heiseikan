
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    // Check if user is authenticated by looking for saved credentials
    const username = localStorage.getItem('karate_username');
    
    if (!username) {
      // Redirect to login page if not authenticated
      navigate('/', { replace: true });
    } else {
      setIsAuthenticated(true);
    }
    
    setIsChecking(false);
  }, [navigate]);

  // While checking authentication, return null (don't render anything)
  if (isChecking) {
    return null;
  }
  
  // If authenticated, render children
  return isAuthenticated ? <>{children}</> : null;
}
