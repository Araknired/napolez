import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, LogOut, Home, Package, Trophy, Award, UserCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

type NavItem = { name: string; path: string; icon: React.ReactNode; gradient?: string };

const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [prevPath, setPrevPath] = useState(location.pathname);

  const isArenaActive = location.pathname === '/arena';
  const isLoginActive = location.pathname === '/login' || location.pathname === '/register';
  const isForgotPasswordActive = location.pathname === '/forgot-password' || location.pathname === '/reset-password';
  const isProfileActive = location.pathname === '/profile' || location.pathname === '/profile/edit';
  const isSponsorsActive = location.pathname === '/sponsors';
  const isTransparentMode = isArenaActive || isLoginActive || isForgotPasswordActive || isProfileActive;

  useEffect(() => {
    if (prevPath !== location.pathname) {
      setPrevPath(location.pathname);
    }
  }, [location.pathname, prevPath]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 20);

      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const navItems: NavItem[] = [
    { name: 'Home', path: '/', icon: <Home className="w-4 h-4" /> },
    { name: 'Product', path: '/product', icon: <Package className="w-4 h-4" /> },
    { name: 'Arena', path: '/arena', icon: <Trophy className="w-4 h-4" /> },
    { name: 'Sponsors', path: '/sponsors', icon: <Award className="w-4 h-4" />, gradient: 'from-green-500 via-green-600 to-emerald-600' },
    { name: 'About Me', path: '/about', icon: <UserCircle className="w-4 h-4" />, gradient: 'from-red-500 via-red-600 to-rose-600' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <nav className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    } ${
      isTransparentMode
        ? 'border-b border-gray-300'
        : scrolled 
          ? 'bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-black/50 border-b border-slate-700/50' 
          : 'bg-black/30 backdrop-blur-md border-b border-white/5'
    }`}>
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-3.5 md:py-4.5">
        <div className="flex items-center justify-between">
          
          <Link to="/" className="flex items-center gap-4 group relative">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              <img 
                src="/logo512.png" 
                alt="NAPOLEZ" 
                className="h-8 sm:h-9 md:h-11 relative z-10 transition-all duration-300 group-hover:scale-110 drop-shadow-2xl" 
              />
            </div>
            <div className="hidden xl:flex flex-col">
              <span className={`text-xl font-bold tracking-tight leading-none transition-all duration-700 ${
                isTransparentMode 
                  ? 'text-black' 
                  : 'bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'
              }`}>
                NAPOLEZ
              </span>
              <span className={`text-[9px] font-medium tracking-widest uppercase transition-all duration-700 ${
                isArenaActive ? 'text-black font-bold' : isLoginActive ? 'text-black font-bold' : isForgotPasswordActive ? 'text-black font-bold' : isProfileActive ? 'text-black font-bold' : 'text-white font-bold'
              }`}>
                {isArenaActive ? 'GASTRONOMY' : isLoginActive ? 'WELCOME' : isForgotPasswordActive ? 'RECOVERY' : isProfileActive ? 'YOUR PROFILE' : isSponsorsActive ? 'NAPOLEZ UI/UX' : 'THE GOLDEN NAPOLES'}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-500 ${
                  isActive(item.path) 
                    ? 'text-white' 
                    : isTransparentMode 
                      ? 'text-black hover:text-gray-700'
                      : 'text-gray-400 hover:text-white'
                }`}
                style={{ 
                  transitionDelay: `${index * 30}ms` 
                }}
              >
                {isActive(item.path) && (
                  <>
                    <div className={`absolute inset-0 rounded-xl opacity-100 transition-all duration-700 ${
                      item.gradient
                        ? `bg-gradient-to-r ${item.gradient}`
                        : item.path === '/arena' 
                        ? 'bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500'
                        : item.path === '/'
                        ? 'bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-600'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600'
                    }`}></div>
                    <div className={`absolute inset-0 rounded-xl blur-xl opacity-50 transition-all duration-700 ${
                      item.gradient
                        ? `bg-gradient-to-r ${item.gradient}`
                        : item.path === '/arena' 
                        ? 'bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500'
                        : item.path === '/'
                        ? 'bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-600'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600'
                    }`}></div>
                  </>
                )}
                
                {!isActive(item.path) && (
                  <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 ${
                    isTransparentMode ? 'bg-gray-100' : 'bg-white/5'
                  }`}></div>
                )}
                
                <span className={`relative z-10 transition-transform duration-300 ${
                  isActive(item.path) ? '' : 'group-hover:scale-110'
                }`}>
                  {item.icon}
                </span>
                <span className="relative z-10">{item.name}</span>
                
                {isActive(item.path) && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="group relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-600 transition-transform duration-300 group-hover:scale-105"></div>
                  <div className="absolute inset-0 border border-gray-400/50 rounded-xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-400/0 to-gray-500/0 group-hover:from-gray-400/20 group-hover:to-gray-500/20 transition-all duration-300"></div>
                  <User className="w-4 h-4 relative z-10 text-white" />
                  <span className="relative z-10 text-white">Profile</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="group relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 transition-transform duration-300 group-hover:scale-105"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
                  <LogOut className="w-4 h-4 relative z-10 text-white" />
                  <span className="relative z-10 text-white">Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="group relative px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 overflow-hidden"
                >
                  <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                    isTransparentMode 
                      ? 'bg-gray-200 border border-gray-300 group-hover:bg-gray-300' 
                      : 'bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20'
                  }`}></div>
                  <span className={`relative z-10 ${isTransparentMode ? 'text-black' : 'text-white'}`}>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="group relative px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 transition-transform duration-300 group-hover:scale-105"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 text-white">Register</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;