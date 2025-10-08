import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMenu } from '../context/MenuContext';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { setIntendedPath } = useMenu();

  useEffect(() => {
    // Guardar la intención cuando el usuario intenta acceder sin estar autenticado
    if (!user && !loading) {
      setIntendedPath(location.pathname);
      // También guardar en sessionStorage para logins sociales
      sessionStorage.setItem('intendedPath', location.pathname);
    }
  }, [user, loading, location.pathname, setIntendedPath]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    // Guardar la ruta que el usuario intentó visitar
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}