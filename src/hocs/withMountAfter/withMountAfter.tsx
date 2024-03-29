import { useEffect, useRef, useState } from 'react';

export const withMountAfter =
  (mountAfter: number) =>
  <TProps extends Record<string, unknown>>(Component: (props: TProps) => JSX.Element | null) =>
  // eslint-disable-next-line react/display-name
  (props: TProps) => {
    const timeoutRef = useRef<NodeJS.Timeout>();
    const [shouldMount, setShouldMount] = useState(false);

    useEffect(() => {
      if (mountAfter) {
        timeoutRef.current = setTimeout(() => {
          setShouldMount(true);
        }, mountAfter);
      }

      return () => {
        clearTimeout(timeoutRef.current);
      };
    }, []);

    if (shouldMount) return <Component {...props} />;

    return null;
  };
