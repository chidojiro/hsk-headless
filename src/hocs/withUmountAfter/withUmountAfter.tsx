import React from 'react';

export const withUmountAfter =
  (unmountAfter: number) =>
  <TProps,>(Component: (props: TProps) => JSX.Element | null) =>
  // eslint-disable-next-line react/display-name
  (props: TProps) => {
    const timeoutRef = React.useRef<NodeJS.Timeout>();
    const [shouldMount, setShouldMount] = React.useState(true);

    React.useEffect(() => {
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
