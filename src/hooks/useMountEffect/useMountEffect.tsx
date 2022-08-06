import React from 'react';

export const useMountEffect = (effect: () => void) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(effect, []);
};
