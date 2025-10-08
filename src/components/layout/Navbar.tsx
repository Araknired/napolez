import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

type NavItem = { name: string; path: string };

const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

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
    { name: 'Home', path: '/' },
    { name: 'Product', path: '/product' },
    { name: 'Arena', path: '/arena' },
    { name: 'Store', path: '/store' },
    { name: 'Sponsors', path: '/sponsors' },
    { name: 'About Me', path: '/about' },
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
    <>
      {/* Navbar solo visible en pantallas grandes (lg+) */}
      <nav className={`hidden lg:block fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md transition-all duration-700 ${
        isLoading ? 'opacity-0 -translate-y-full' : 'opacity-100'
      } ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4 md:py-6">
          <div className={`flex items-center justify-between transition-all duration-500 ${
            isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`} style={{ transitionDelay: isLoading ? '0ms' : '200ms' }}>
            
            <Link to="/" className={`flex items-center z-50 transition-all duration-500 ${
              isLoading ? 'opacity-0 -translate-x-10' : 'opacity-100 translate-x-0'
            }`} style={{ transitionDelay: isLoading ? '0ms' : '400ms' }}>
              <img 
                src="/logo512.png" 
                alt="NAPOLEZ" 
                className="h-8 sm:h-10 md:h-12 transition-all duration-300" 
              />
            </Link>

            <div className={`flex items-center gap-8 xl:gap-12 transition-all duration-500 ${
              isLoading ? 'opacity-0 -translate-y-5' : 'opacity-100 translate-y-0'
            }`} style={{ transitionDelay: isLoading ? '0ms' : '600ms' }}>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-white text-base xl:text-lg font-medium transition-all duration-300 hover:opacity-80 ${
                    isActive(item.path) ? 'opacity-100 font-bold' : 'opacity-70'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className={`flex items-center gap-3 md:gap-4 transition-all duration-500 ${
              isLoading ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'
            }`} style={{ transitionDelay: isLoading ? '0ms' : '800ms' }}>
              
              <div className="flex items-center gap-3">
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 xl:px-5 py-2 xl:py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-medium transition-all duration-300 border border-white/30"
                    >
                      <User className="w-4 h-4 xl:w-5 xl:h-5" />
                      <span className="text-sm xl:text-base">Profile</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 px-4 xl:px-5 py-2 xl:py-2.5 rounded-full bg-red-500/80 hover:bg-red-600 text-white font-medium transition-all duration-300"
                    >
                      <LogOut className="w-4 h-4 xl:w-5 xl:h-5" />
                      <span className="text-sm xl:text-base">Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="px-4 xl:px-5 py-2 xl:py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-medium transition-all duration-300 border border-white/30 text-sm xl:text-base"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="px-4 xl:px-5 py-2 xl:py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-300 text-sm xl:text-base"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;