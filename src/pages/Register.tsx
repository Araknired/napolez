import { useIsDesktop } from '../hooks/useMediaQuery';
import RegisterMobile from './Register/RegisterMobile';
import RegisterDesktop from './Register/RegisterDesktop';

export default function Register() {
  const isDesktop = useIsDesktop();

  return isDesktop ? <RegisterDesktop /> : <RegisterMobile />;
}