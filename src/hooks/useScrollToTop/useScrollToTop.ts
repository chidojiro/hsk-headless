import { useLocation } from 'react-router-dom';
import React from 'react';

export const useScrollToTop = (deps: unknown[]) => {
  const { pathname } = useLocation();

  React.useLayoutEffect(() => {
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps || [pathname]);
};
