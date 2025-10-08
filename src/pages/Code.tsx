import { useIsDesktop } from '../hooks/useMediaQuery';
import CodeMobile from './Code/CodeMobile';
import CodeDesktop from './Code/CodeDesktop';

export default function Code() {
  const isDesktop = useIsDesktop();

  return isDesktop ? <CodeDesktop /> : <CodeMobile />;
}