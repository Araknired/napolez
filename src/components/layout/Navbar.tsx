import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Star, User, LogOut, LogIn } from 'lucide-react';
import { useMenu } from '../../context/MenuContext';
import { useAuth } from '../../context/AuthContext';

type NavItem = { name: string; path: string };

const Navbar: React.FC = () => {
  const location = useLocation();
  const { isMenuOpen, toggleMenu } = useMenu();
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

  const closeMenu = () => {
    toggleMenu();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      if (isMenuOpen) closeMenu();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md transition-all duration-700 ${
        isLoading ? 'opacity-0 -translate-y-full' : 'opacity-100'
      } ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4 md:py-6">
          <div className={`flex items-center justify-between transition-all duration-500 ${
            isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`} style={{ transitionDelay: isLoading ? '0ms' : '200ms' }}>
            
            <Link to="/" className={`flex items-center z-50 transition-all duration-500 ${
              isLoading ? 'opacity-0 -translate-x-10' : 'opacity-100 translate-x-0'
            }`} style={{ transitionDelay: isLoading ? '0ms' : '400ms' }} onClick={isMenuOpen ? closeMenu : undefined}>
              <img 
                src="/logo512.png" 
                alt="NAPOLEZ" 
                className="h-8 sm:h-10 md:h-12 transition-all duration-300" 
              />
            </Link>

            <div className={`hidden lg:flex items-center gap-8 xl:gap-12 transition-all duration-500 ${
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
              
              <div className="hidden lg:flex items-center gap-3">
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

              <button 
                onClick={toggleMenu}
                className="lg:hidden bg-white backdrop-blur-sm p-2 md:p-2.5 rounded-full hover:bg-gray-100 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 z-50 border-2 border-gray-200"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
                ) : (
                  <Menu className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div 
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          isMenuOpen ? 'visible' : 'invisible'
        }`}
        style={{ top: '80px' }}
      >
        <div 
          className={`absolute inset-0 bg-gradient-to-br from-blue-900/85 via-white/10 to-red-900/85 backdrop-blur-md transition-opacity duration-500 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeMenu}
        />
        
        <div 
          className={`absolute top-0 right-0 h-full w-[300px] sm:w-[360px] bg-gradient-to-b from-white/98 via-gray-50/96 to-white/98 backdrop-blur-2xl shadow-2xl border-l-4 border-blue-500 transition-transform duration-500 overflow-y-auto ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-red-500 via-white to-blue-600"></div>
          
          <div className="absolute top-8 right-8 opacity-30">
            <Star className="w-6 h-6 text-blue-600 fill-blue-600 animate-pulse" />
          </div>
          <div className="absolute top-20 right-16 opacity-20">
            <Star className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" style={{ animationDelay: '0.3s' }} />
          </div>
          <div className="absolute top-36 right-10 opacity-25">
            <Star className="w-5 h-5 text-blue-500 fill-blue-500 animate-pulse" style={{ animationDelay: '0.6s' }} />
          </div>

          <div className="flex flex-col min-h-full pt-8 px-6 pb-6 relative">
            
            <div className={`mb-8 text-center transition-all duration-500 ${
              isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
            }`} style={{ transitionDelay: isMenuOpen ? '100ms' : '0ms' }}>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 via-blue-700 to-red-600 bg-clip-text text-transparent">
                NAPOLEZ
              </h2>
              <p className="text-xs text-gray-600 mt-1 tracking-widest font-semibold">2025 EDITION</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <div className="h-[2px] w-10 bg-red-500"></div>
                <div className="h-[2px] w-10 bg-white border border-gray-300"></div>
                <div className="h-[2px] w-10 bg-blue-600"></div>
              </div>
            </div>

            {user && (
              <div className={`mb-6 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-red-50 border-2 border-blue-200 transition-all duration-500 ${
                isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
              }`} style={{ transitionDelay: isMenuOpen ? '150ms' : '0ms' }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">{user.email}</p>
                    <p className="text-xs text-gray-600">Active user</p>
                  </div>
                </div>
              </div>
            )}

            <nav className="flex flex-col space-y-3 mb-6">
              {navItems.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMenu}
                  className={`relative text-gray-800 text-lg font-semibold py-4 px-6 rounded-xl transition-all duration-500 overflow-hidden group cursor-pointer block ${
                    isActive(item.path) 
                      ? 'bg-gradient-to-r from-red-500 to-blue-600 text-white shadow-lg shadow-blue-500/40 border-2 border-white' 
                      : 'bg-white hover:bg-gradient-to-r hover:from-red-50 hover:to-blue-50 border-2 border-gray-200 hover:border-blue-400 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                  } ${isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
                  style={{
                    transitionDelay: isMenuOpen ? `${200 + index * 100}ms` : '0ms'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  
                  {isActive(item.path) && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-gradient-to-b from-white via-white to-white rounded-r-full shadow-lg shadow-white/50"></div>
                  )}
                  
                  <span className="relative z-10">{item.name}</span>
                  
                  {isActive(item.path) && (
                    <>
                      <Star className="absolute top-2 right-2 w-3 h-3 text-white fill-white opacity-70" />
                      <Star className="absolute bottom-2 right-2 w-3 h-3 text-white fill-white opacity-70" />
                    </>
                  )}
                </Link>
              ))}
            </nav>

            <div className={`space-y-3 mb-6 transition-all duration-500 ${
              isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`} style={{ transitionDelay: isMenuOpen ? `${200 + navItems.length * 100}ms` : '0ms' }}>
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                  >
                    <User className="w-5 h-5" />
                    <span>My Profile</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-xl bg-white border-2 border-blue-400 text-blue-600 font-semibold shadow-md hover:shadow-lg hover:bg-blue-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                  >
                    <User className="w-5 h-5" />
                    <span>Register</span>
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center justify-center gap-1 mb-6">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-red-300"></div>
              <Star className="w-3 h-3 text-blue-500 fill-blue-500" />
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-blue-300"></div>
            </div>

            <div className={`text-center space-y-3 transition-all duration-500 ${
              isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`} style={{ transitionDelay: isMenuOpen ? '700ms' : '0ms' }}>
              <div className="flex items-center justify-center gap-2">
                <Star className="w-4 h-4 text-red-500 fill-red-500" />
                <Star className="w-5 h-5 text-blue-600 fill-blue-600" />
                <Star className="w-4 h-4 text-red-500 fill-red-500" />
              </div>
              
              <p className="text-gray-700 text-sm font-bold tracking-wide">
                © 2025 NAPOLEZ
              </p>
              <p className="text-gray-500 text-xs font-medium">
                PREMIUM EXPERIENCE
              </p>
              
              <div className="flex justify-center gap-1.5 mt-2">
                <div className="w-16 h-1.5 bg-blue-600 rounded-full shadow-sm"></div>
                <div className="w-16 h-1.5 bg-white border border-gray-300 rounded-full shadow-sm"></div>
                <div className="w-16 h-1.5 bg-red-500 rounded-full shadow-sm"></div>
              </div>
            </div>
          </div>

          <div className="absolute top-1/4 right-0 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-0 w-40 h-40 bg-red-400/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </>
  );
};

export default Navbar;