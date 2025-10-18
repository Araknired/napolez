import { useEffect, useState } from 'react';
import type { FC } from 'react';

import ForgotDesktop from './ForgotPassword/ForgotDesktop';
import ForgotMobile from './ForgotPassword/ForgotMobile';

const MOBILE_BREAKPOINT = 1024;

/**
 * ForgotPassword component that renders responsive views based on screen size.
 * Displays mobile layout below 1024px, desktop layout otherwise.
 */
const ForgotPassword: FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(() => 
    typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT
  );

  useEffect(() => {
    const handleResize = (): void => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile ? <ForgotMobile /> : <ForgotDesktop />;
};

export default ForgotPassword;