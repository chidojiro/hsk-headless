import React from 'react';

export const useStateToggle = (defaultState = false): [boolean, (state?: boolean) => void] => {
  const [state, setState] = React.useState(defaultState);

  const toggler = React.useCallback((state?: boolean) => {
    setState(prev => (typeof state !== 'undefined' ? state : !prev));
  }, []);

  return [state, toggler];
};
