import { useLocation } from 'react-router';
import React from 'react';

const useScrollToTop = (deps: any[]) => {
  const { pathname } = useLocation();

  React.useLayoutEffect(() => {
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps || [pathname]);
};

export default useScrollToTop;
