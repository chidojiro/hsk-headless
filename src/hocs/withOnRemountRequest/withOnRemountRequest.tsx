import { useCallback, useState } from 'react';

export type WithOnRemountRequestProps = {
  onRemountRequest: () => void;
};

export const withOnRemountRequest =
  <T extends WithOnRemountRequestProps>(Component: (props: T) => JSX.Element | null) =>
  // eslint-disable-next-line react/display-name
  (props: Omit<T, keyof WithOnRemountRequestProps>) => {
    const [key, setKey] = useState(Math.random());

    const remount = useCallback(() => {
      setKey(Math.random());
    }, []);

    return <Component key={key} {...(props as any)} onRemountRequest={remount} />;
  };
