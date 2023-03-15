import { useEffect, useState } from 'react';

export const useDebouncedValue = <TValue>(value: TValue, debounceBy: number) => {
  const [debouncedValue, setDebouncedValue] = useState<TValue>(value);

  useEffect(
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
