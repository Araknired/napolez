import { useIsDesktop } from '../hooks/useMediaQuery';
import LoginMobile from './Login/LoginMobile';
import LoginDesktop from './Login/LoginDesktop';

export default function Login() {
  const isDesktop = useIsDesktop();

  return isDesktop ? <LoginDesktop /> : <LoginMobile />;
}