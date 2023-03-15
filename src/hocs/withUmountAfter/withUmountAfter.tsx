import { useEffect, useRef, useState } from 'react';

export const withUmountAfter =
  (unmountAfter: number) =>
  <TProps extends Record<string, unknown>>(Component: (props: TProps) => JSX.Element | null) =>
  // eslint-disable-next-line react/display-name
  (props: TProps) => {
    const timeoutRef = useRef<NodeJS.Timeout>();
    const [shouldMount, setShouldMount] = useState(true);

    useEffect(() => {
      if (unmountAfter) {
        timeoutRef.current = setTimeout(() => {
          setShouldMount(false);
        }, unmountAfter);
      }

      return () => {
        clearTimeout(timeoutRef.current);
      };
    }, []);

    if (shouldMount) return <Component {...props} />;

    return null;
  };
