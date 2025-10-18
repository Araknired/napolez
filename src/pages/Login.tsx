import type { FC } from 'react';
import { useIsDesktop } from '../hooks/useMediaQuery';
import LoginMobile from './Login/LoginMobile';
import LoginDesktop from './Login/LoginDesktop';

/**
 * Responsive login component that renders desktop or mobile view
 * based on screen size breakpoint.
 */
const Login: FC = () => {
  const isDesktop = useIsDesktop();

  return isDesktop ? <LoginDesktop /> : <LoginMobile />;
};

export default Login;