import React from 'react';

export const useDebounce = <TValue>(value: TValue, debounceBy: number) => {
  const [debouncedValue, setDebouncedValue] = React.useState<TValue>(value);

  React.useEffect(
    () => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, debounceBy);

      return () => {
        clearTimeout(handler);
      };
    },
    [value, debounceBy] // Only re-call effect if value or delay changes
  );
  return debouncedValue;
};
