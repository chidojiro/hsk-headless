import React from 'react';

export const withUmountAfter =
  (unmountAfter: number) =>
  <TProps,>(Component: (props: TProps) => JSX.Element | null) =>
  // eslint-disable-next-line react/display-name
  (props: TProps) => {
    const [shouldMount, setShouldMount] = React.useState(true);

    React.useEffect(() => {
      if (unmountAfter) {
        setTimeout(() => {
          setShouldMount(false);
        }, unmountAfter);
      }
    }, []);

    if (shouldMount) return <Component {...props} />;

    return null;
  };
