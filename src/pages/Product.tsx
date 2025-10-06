import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useMenu } from '../contexts/MenuContext';
import PepsiSection from '../components/product/PepsiSection';
import CocaColaSection from '../components/product/CocaColaSection';
import RedBullSection from '../components/product/RedBullSection';

/**
 * Product Component
 * 
 * A full-screen paginated component that displays different product brand sections.
 * Users can navigate between sections using up/down navigation buttons.
 * Each section is rendered as an independent component for better modularity.
 */
const Product = () => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  /**
   * Tracks the current visible section index
   * Range: 0 to sections.length - 1
   */
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  
  /**
   * Get menu state from context
   * Used to hide navigation buttons when mobile menu is open
   */
  const { isMenuOpen } = useMenu();

  // ============================================================================
  // DATA CONFIGURATION
  // ============================================================================
  
  /**
   * Configuration array for all product sections
   * Each section represents a different brand with its own component
   * 
   * @property {string} id - Unique identifier for the section
   * @property {JSX.Element} component - React component to render for this section
   */
  const sections = [
    { 
      id: 'pepsi', 
      component: <PepsiSection /> 
    },
    { 
      id: 'cocacola', 
      component: <CocaColaSection /> 
    },
    { 
      id: 'redbull', 
      component: <RedBullSection /> 
    },
  ];

  // ============================================================================
  // NAVIGATION HANDLERS
  // ============================================================================
  
  /**
   * Navigate to the next product section
   * Only triggers if there is a next section available
   * 
   * @returns {void}
   */
  const scrollToNext = (): void => {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  /**
   * Navigate to the previous product section
   * Only triggers if there is a previous section available
   * 
   * @returns {void}
   */
  const scrollToPrev = (): void => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================
  
  /**
   * Check if we're on the first section
   * Used to disable the "previous" button
   */
  const isFirstSection = currentSectionIndex === 0;
  
  /**
   * Check if we're on the last section
   * Used to disable the "next" button
   */
  const isLastSection = currentSectionIndex === sections.length - 1;

  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  
  return (
    <div className="relative h-screen overflow-hidden">
      {/* Navigation Controls - Hidden when mobile menu is open */}
      {/* Only show on mobile/tablet when menu is closed, always show on desktop */}
      <div className={`fixed right-4 bottom-40 md:right-12 md:bottom-32 flex flex-col gap-3 z-50 transition-all duration-300 ${
        isMenuOpen ? 'lg:flex opacity-0 invisible lg:opacity-100 lg:visible' : 'flex opacity-100 visible'
      }`}>
        {/* Previous Section Button */}
        <button 
          onClick={scrollToPrev}
          disabled={isFirstSection}
          className="bg-white opacity-50 md:opacity-100 p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.6)] hover:opacity-70 md:hover:opacity-100 hover:shadow-[0_12px_40px_rgb(0,0,0,0.8)] hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
          aria-label="Previous product section"
        >
          <ChevronUp className="w-7 h-7 text-[#0a0d1f]" />
        </button>
        
        {/* Next Section Button */}
        <button 
          onClick={scrollToNext}
          disabled={isLastSection}
          className="bg-white opacity-50 md:opacity-100 p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.6)] hover:opacity-70 md:hover:opacity-100 hover:shadow-[0_12px_40px_rgb(0,0,0,0.8)] hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
          aria-label="Next product section"
        >
          <ChevronDown className="w-7 h-7 text-[#0a0d1f]" />
        </button>
      </div>

      {/* Main Content Area - Renders current section component */}
      <div className="h-screen w-full">
        {sections[currentSectionIndex].component}
      </div>
    </div>
  );
};

export default Product;