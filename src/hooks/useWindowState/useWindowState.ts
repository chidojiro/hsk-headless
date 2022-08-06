import { AssertUtils } from 'utils';
import React from 'react';
import { isEqual } from 'lodash-es';

export const useWindowState = <T = unknown>(
  key: string,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, _setState] = React.useState<T>(((window as any)[key] ?? defaultValue) as T);

  const eventKey = `useWindowState-${key}`;

  React.useEffect(() => {
    window.addEventListener(eventKey, v => {
      _setState(prev => {
        if (isEqual(prev, v)) return;

        return (v as any).detail;
      });
    });
  }, [eventKey, key]);

  const setState = React.useCallback(
    v => {
      if (AssertUtils.isFunction(v)) {
        _setState(prev => {
          const newValue = v(prev);

          (window as any)[key] = newValue;
          window.dispatchEvent(new CustomEvent(eventKey, { detail: newValue }));

          return newValue;
        });
        return;
      }

      _setState(v);
      (window as any)[key] = v;
      window.dispatchEvent(new CustomEvent(eventKey, { detail: v }));
    },
    [eventKey, key]
  );

  return [state, setState];
};
