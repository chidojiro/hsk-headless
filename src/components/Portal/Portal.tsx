import { createPortal } from 'react-dom';
import { Children } from '@/types';

export type PortalProps = Children & {
  asChildOf?: HTMLElement | null;
};

export const Portal = ({ children, asChildOf }: PortalProps) => {
  return createPortal(children, asChildOf ?? document.body);
};
