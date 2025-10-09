import { useEffect, useState } from 'react';
import ForgotDesktop from './ForgotPassword/ForgotDesktop';
import ForgotMobile from './ForgotPassword/ForgotMobile';

export default function ForgotPassword() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile ? <ForgotMobile /> : <ForgotDesktop />;
}