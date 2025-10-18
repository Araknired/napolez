import type { FC } from 'react';
import { useIsDesktop } from '../hooks/useMediaQuery';
import CodeMobile from './Code/CodeMobile';
import CodeDesktop from './Code/CodeDesktop';

/**
 * Responsive Code component that renders desktop or mobile version
 * based on viewport size.
 */
const Code: FC = () => {
  const isDesktop = useIsDesktop();

  return isDesktop ? <CodeDesktop /> : <CodeMobile />;
};

export default Code;