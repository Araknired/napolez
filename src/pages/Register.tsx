import type { FC, ReactElement } from 'react';
import { useIsDesktop } from '../hooks/useMediaQuery';
import RegisterMobile from './Register/RegisterMobile';
import RegisterDesktop from './Register/RegisterDesktop';

/**
 * Register page component with responsive layout
 * Renders desktop or mobile version based on viewport size
 */
const Register: FC = (): ReactElement => {
  const isDesktop = useIsDesktop();

  return isDesktop ? <RegisterDesktop /> : <RegisterMobile />;
};

export default Register;