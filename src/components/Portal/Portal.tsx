import React from 'react';
import { createPortal } from 'react-dom';
import { Children } from 'types';

type Props = Children & {
  asChildOf?: HTMLElement | null;
};

export const Portal = ({ children, asChildOf }: Props) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? createPortal(children, asChildOf ?? document.body) : null;
};
