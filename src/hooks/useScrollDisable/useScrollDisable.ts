import { useLayoutEffect } from 'react';

export const useScrollDisable = (disable: boolean) => {
  useLayoutEffect(() => {
    if (disable) {
      const currentWidth = document.documentElement.offsetWidth;

      document.documentElement.style.setProperty('overflow', 'hidden', 'important');

      const fullWidth = document.documentElement.offsetWidth;

      document.documentElement.style.setProperty('padding-right', fullWidth - currentWidth + 'px');
    } else {
      document.documentElement.style.removeProperty('overflow');
      document.documentElement.style.removeProperty('padding-right');
    }
  }, [disable]);

  useLayoutEffect(() => {
    return () => {
      document.documentElement.style.removeProperty('overflow');
      document.documentElement.style.removeProperty('padding-right');
    };
  }, []);
};
