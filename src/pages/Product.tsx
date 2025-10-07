import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useMenu } from '../context/MenuContext';
import PepsiSection from '../components/product/PepsiSection';
import CocaColaSection from '../components/product/CocaColaSection';
import RedBullSection from '../components/product/RedBullSection';

const Product = () => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const { isMenuOpen } = useMenu();

  const sections = [
    { id: 'pepsi', component: <PepsiSection /> },
    { id: 'cocacola', component: <CocaColaSection /> },
    { id: 'redbull', component: <RedBullSection /> },
  ];

  const scrollToNext = (): void => {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  const scrollToPrev = (): void => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSectionIndex === sections.length - 1;

  return (
    <div className="relative h-screen overflow-hidden">
      <div
        className={`fixed right-4 bottom-40 md:right-12 md:bottom-32 flex flex-col gap-3 z-50 transition-all duration-300 ${
          isMenuOpen
            ? 'lg:flex opacity-0 invisible lg:opacity-100 lg:visible'
            : 'flex opacity-100 visible'
        }`}
      >
        <button
          onClick={scrollToPrev}
          disabled={isFirstSection}
          className="bg-white opacity-50 md:opacity-100 p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.6)] hover:opacity-70 md:hover:opacity-100 hover:shadow-[0_12px_40px_rgb(0,0,0,0.8)] hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
          aria-label="Previous product section"
        >
          <ChevronUp className="w-7 h-7 text-[#0a0d1f]" />
        </button>

        <button
          onClick={scrollToNext}
          disabled={isLastSection}
          className="bg-white opacity-50 md:opacity-100 p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.6)] hover:opacity-70 md:hover:opacity-100 hover:shadow-[0_12px_40px_rgb(0,0,0,0.8)] hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
          aria-label="Next product section"
        >
          <ChevronDown className="w-7 h-7 text-[#0a0d1f]" />
        </button>
      </div>

      <div className="h-screen w-full">
        {sections[currentSectionIndex].component}
      </div>
    </div>
  );
};

export default Product;
