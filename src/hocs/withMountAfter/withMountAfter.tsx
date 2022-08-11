import React from 'react';

export const withMountAfter =
  (mountAfter: number) =>
  <TProps,>(Component: (props: TProps) => JSX.Element | null) =>
  // eslint-disable-next-line react/display-name
  (props: TProps) => {
    const [shouldMount, setShouldMount] = React.useState(false);

    React.useEffect(() => {
      if (mountAfter) {
        setTimeout(() => {
          setShouldMount(true);
        }, mountAfter);
      }
    }, []);

    if (shouldMount) return <Component {...props} />;

    return null;
  };
