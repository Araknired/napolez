import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, Trophy, ShoppingCart, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMenu } from '../../context/MenuContext';
import { useTheme } from '../../context/ThemeContext'; // Importar useTheme

type TabItem = {
  name: string;
  path: string;
  icon: React.ElementType;
  colors: {
    gradient: string;
    shadow: string;
    wave: string;
  };
};

const MobileTabBar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { intendedPath, setIntendedPath } = useMenu();
  const { theme } = useTheme(); // USAR useTheme
  const [previousPath, setPreviousPath] = useState(location.pathname);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const tabItems: TabItem[] = [
    {
      name: 'Home',
      path: '/',
      icon: Home,
      colors: {
        gradient: 'from-blue-600 via-blue-500 to-blue-700',
        shadow: 'shadow-blue-500/50',
        wave: 'border-blue-300',
      },
    },
    {
      name: 'Product',
      path: '/product',
      icon: Package,
      colors: {
        gradient: 'from-purple-600 via-purple-500 to-purple-700',
        shadow: 'shadow-purple-500/50',
        wave: 'border-purple-300',
      },
    },
    {
      name: 'Arena',
      path: '/arena',
      icon: Trophy,
      colors: {
        gradient: 'from-yellow-600 via-yellow-500 to-yellow-700',
        shadow: 'shadow-yellow-500/50',
        wave: 'border-yellow-300',
      },
    },
    {
      name: 'Cart',
      path: '/cart',
      icon: ShoppingCart,
      colors: {
        gradient: 'from-orange-600 via-orange-500 to-orange-700', // Modificado a naranja/rojo para que haga match con el estilo general
        shadow: 'shadow-orange-500/50',
        wave: 'border-orange-300',
      },
    },
    {
      name: 'Profile',
      path: user ? '/profile' : '/login',
      icon: User,
      colors: {
        gradient: 'from-red-600 via-red-500 to-red-700',
        shadow: 'shadow-red-500/50',
        wave: 'border-red-300',
      },
    },
  ];

  useEffect(() => {
    if (previousPath !== location.pathname) {
      setIsTransitioning(true);
      setPreviousPath(location.pathname);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, previousPath]);

  const getActiveTab = () => {
    if ((location.pathname === '/login' || location.pathname === '/register') && intendedPath) {
      return intendedPath;
    }
    return location.pathname;
  };

  const activeTab = getActiveTab();
  const isActive = (path: string) => activeTab === path;

  const handleTabClick = (path: string) => {
    setIntendedPath(path);
    localStorage.setItem('intendedPath', path);
  };

  // CLASES CONDICIONALES PARA MODO OSCURO
  const tabBarClasses = theme === 'dark' 
    ? 'bg-slate-900 border-t border-slate-700 shadow-2xl shadow-black/50' 
    : 'bg-white border-t border-gray-200 shadow-2xl';
  
  const inactiveTextClasses = theme === 'dark' 
    ? 'text-gray-400 hover:text-blue-400' 
    : 'text-gray-500 hover:text-blue-600';

  const activeIconBorder = theme === 'dark' 
    ? 'border-slate-900' 
    : 'border-white';

  return (
    <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 ${tabBarClasses}`}>
      <div className="flex items-center justify-around px-2 py-3 pb-safe">
        {tabItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => handleTabClick(item.path)}
              className={`relative flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl ${
                active ? 'text-white' : inactiveTextClasses
              }`}
            >
              {active && (
                <>
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.colors.gradient} rounded-2xl shadow-lg ${item.colors.shadow}`}
                  ></div>
                  <div
                    className={`absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br ${item.colors.gradient} rounded-full shadow-xl ${item.colors.shadow} flex items-center justify-center border-4 ${activeIconBorder}`}
                  >
                    <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  {isTransitioning && (
                    <div
                      className={`absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-2 ${item.colors.wave}`}
                      style={{ animation: 'ping 0.5s cubic-bezier(0, 0, 0.2, 1)' }}
                    ></div>
                  )}
                </>
              )}
              <div className="relative z-10 flex flex-col items-center gap-1">
                {!active && <Icon className="w-6 h-6 transition-all duration-500 scale-100 opacity-100" strokeWidth={2} />}
                <span className={`text-xs font-semibold ${active ? 'mt-3 opacity-100' : 'opacity-80'}`}>{item.name}</span>
              </div>
              {active && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full opacity-80"></div>}
            </Link>
          );
        })}
      </div>
      <style>{`
        .pb-safe {
          padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default MobileTabBar;