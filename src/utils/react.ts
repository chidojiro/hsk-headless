import React from 'react';

export const createContext = <T = unknown>(): [React.Provider<T>, () => T] => {
  const context = React.createContext<T>(null as any);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const hook = () => React.useContext(context);

  return [context.Provider, hook];
};
