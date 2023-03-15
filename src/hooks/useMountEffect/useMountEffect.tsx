import { useEffect } from 'react';

export const useMountEffect = (effect: () => void) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, []);
};
