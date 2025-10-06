import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

/**
 * Menu Context - Manages mobile menu state across components
 * 
 * This context allows the Navbar and Product components to share
 * the mobile menu open/closed state, enabling coordinated UI behavior
 */

interface MenuContextType {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  toggleMenu: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

/**
 * MenuProvider Component
 * Wrap your app with this provider to enable menu state sharing
 */
export const MenuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(prev => {
      const newState = !prev;
      // Prevent body scroll when menu is open on mobile
      document.body.style.overflow = newState ? 'hidden' : 'unset';
      return newState;
    });
  };

  return (
    <MenuContext.Provider value={{ isMenuOpen, setIsMenuOpen, toggleMenu }}>
      {children}
    </MenuContext.Provider>
  );
};

/**
 * Custom hook to use the menu context
 * @throws Error if used outside of MenuProvider
 */
export const useMenu = (): MenuContextType => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};