import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, Star } from 'lucide-react';
import { useMenu } from '../../contexts/MenuContext';

type NavItem = { name: string; path: string };

/**
 * Navbar Component - Patriotic Edition 2025
 * 
 * Features:
 * - Desktop: Clean original design (unchanged)
 * - Mobile/Tablet: White, Red & Blue theme with premium accents
 * - Modern patriotic glassmorphism effects
 * - Smooth transitions with star decorations
 */
const Navbar: React.FC = () => {
  const location = useLocation();
  const { isMenuOpen, toggleMenu } = useMenu();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Loading animation - only runs once on mount
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Animation duration
    return () => clearTimeout(timer);
  }, []);

  // Navigation items configuration
  const navItems: NavItem[] = [
    { name: 'Home', path: '/' },
    { name: 'Product', path: '/product' },
    { name: 'Arena', path: '/arena' },
    { name: 'Sponsors', path: '/sponsors' },
    { name: 'About Me', path: '/about' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const closeMenu = () => {
    toggleMenu();
  };

  return (
    <>
      {/* Main Navigation Bar - Desktop unchanged, Mobile enhanced */}
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md transition-all duration-700 ${
        isLoading ? 'opacity-0 -translate-y-full' : 'opacity-100 translate-y-0'
      }`}>
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4 md:py-6">
          <div className={`flex items-center justify-between transition-all duration-500 ${
            isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`} style={{ transitionDelay: isLoading ? '0ms' : '200ms' }}>
            
            {/* Logo Section */}
            <Link to="/" className={`flex items-center z-50 transition-all duration-500 ${
              isLoading ? 'opacity-0 -translate-x-10' : 'opacity-100 translate-x-0'
            }`} style={{ transitionDelay: isLoading ? '0ms' : '400ms' }} onClick={isMenuOpen ? closeMenu : undefined}>
              <img 
                src="/logo512.png" 
                alt="NAPOLEZ" 
                className="h-8 sm:h-10 md:h-12 transition-all duration-300" 
              />
            </Link>

            {/* Desktop Navigation Links - Hidden on mobile/tablet */}
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

            {/* Right Section - Search and Mobile Menu */}
            <div className={`flex items-center gap-3 md:gap-4 transition-all duration-500 ${
              isLoading ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'
            }`} style={{ transitionDelay: isLoading ? '0ms' : '800ms' }}>
              
              {/* Desktop Search Bar */}
              <div className="hidden lg:block relative">
                <input
                  type="text"
                  placeholder="Find your drink"
                  className="w-60 xl:w-80 px-6 xl:px-8 py-2 xl:py-3 pr-12 xl:pr-14 text-base xl:text-lg rounded-full bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300"
                />
                <button className="absolute right-3 xl:right-4 top-1/2 -translate-y-1/2">
                  <Search className="w-5 h-5 xl:w-6 xl:h-6 text-white" />
                </button>
              </div>

              {/* Mobile Search Button - Red/Blue hover */}
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="lg:hidden bg-white/90 backdrop-blur-sm p-2 md:p-2.5 rounded-full hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                aria-label="Toggle search"
              >
                <Search className="w-5 h-5 md:w-6 md:h-6 text-gray-700 hover:text-white" />
              </button>

              {/* Hamburger Menu Button - Patriotic Enhancement */}
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

          {/* Mobile Search Bar - Patriotic Enhancement */}
          {isSearchOpen && (
            <div className="lg:hidden mt-4 animate-[slideDown_0.3s_ease-out]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Find your drink"
                  className="w-full px-6 py-3 pr-12 text-base rounded-full bg-white/95 backdrop-blur-md text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border-2 border-red-200 shadow-lg shadow-blue-500/20"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Search className="w-5 h-5 text-blue-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile/Tablet Slide-in Menu - PATRIOTIC EDITION */}
      <div 
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          isMenuOpen ? 'visible' : 'invisible'
        }`}
        style={{ top: '80px' }} // Starts below navbar (adjust based on your navbar height)
      >
        {/* Backdrop Overlay - Patriotic gradient */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br from-blue-900/85 via-white/10 to-red-900/85 backdrop-blur-md transition-opacity duration-500 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeMenu}
        />
        
        {/* Slide-in Menu Panel - Premium White/Red/Blue Design */}
        <div 
          className={`absolute top-0 right-0 h-full w-[300px] sm:w-[360px] bg-gradient-to-b from-white/98 via-gray-50/96 to-white/98 backdrop-blur-2xl shadow-2xl border-l-4 border-blue-500 transition-transform duration-500 ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Patriotic stripe on the edge */}
          <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-red-500 via-white to-blue-600"></div>
          
          {/* Decorative stars */}
          <div className="absolute top-8 right-8 opacity-30">
            <Star className="w-6 h-6 text-blue-600 fill-blue-600 animate-pulse" />
          </div>
          <div className="absolute top-20 right-16 opacity-20">
            <Star className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" style={{ animationDelay: '0.3s' }} />
          </div>
          <div className="absolute top-36 right-10 opacity-25">
            <Star className="w-5 h-5 text-blue-500 fill-blue-500 animate-pulse" style={{ animationDelay: '0.6s' }} />
          </div>

          {/* Menu Content Container */}
          <div className="flex flex-col h-full pt-8 px-6 pb-6 relative">
            
            {/* Patriotic Title */}
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

            {/* Navigation Links List - Patriotic Style */}
            <nav className="flex flex-col space-y-3">
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
                  {/* Animated shine effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  
                  {/* Active indicator - patriotic stripe */}
                  {isActive(item.path) && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-gradient-to-b from-white via-white to-white rounded-r-full shadow-lg shadow-white/50"></div>
                  )}
                  
                  <span className="relative z-10">{item.name}</span>
                  
                  {/* Corner stars for active */}
                  {isActive(item.path) && (
                    <>
                      <Star className="absolute top-2 right-2 w-3 h-3 text-white fill-white opacity-70" />
                      <Star className="absolute bottom-2 right-2 w-3 h-3 text-white fill-white opacity-70" />
                    </>
                  )}
                </Link>
              ))}
            </nav>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Decorative patriotic line */}
            <div className="flex items-center justify-center gap-1 mb-6">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-red-300"></div>
              <Star className="w-3 h-3 text-blue-500 fill-blue-500" />
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-blue-300"></div>
            </div>

            {/* Menu Footer - Patriotic themed */}
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
              
              {/* Patriotic stripes decoration */}
              <div className="flex justify-center gap-1.5 mt-2">
                <div className="w-16 h-1.5 bg-blue-600 rounded-full shadow-sm"></div>
                <div className="w-16 h-1.5 bg-white border border-gray-300 rounded-full shadow-sm"></div>
                <div className="w-16 h-1.5 bg-red-500 rounded-full shadow-sm"></div>
              </div>
            </div>
          </div>

          {/* Ambient glow effects - red and blue */}
          <div className="absolute top-1/4 right-0 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-0 w-40 h-40 bg-red-400/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Custom Animation Styles */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;