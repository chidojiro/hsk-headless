import React from 'react';
import { useDelayableState } from '@/hooks';
import { OpenClose } from '@/types';

type OpenProps = OpenClose;

export const withMountOnOpen =
  (delayCloseBy = 0) =>
  <T extends OpenProps>(Component: (props: T) => JSX.Element | null) =>
  // eslint-disable-next-line react/display-name
  (props: T) => {
    const [cachedProps, setCachedProps] = React.useState<T>(props);
    const [delayabeOpen, setDelayableOpen] = useDelayableState({
      delayBy: delayCloseBy,
      defaultState: props.open,
    });

    React.useEffect(() => {
      setDelayableOpen({ state: !!props.open, shouldDelay: !!delayCloseBy && !props.open });
    }, [props.open, setDelayableOpen]);

    React.useEffect(() => {
      if (props.open) {
        setCachedProps(props);
      }
    }, [props]);

    if (!delayabeOpen) {
      return null;
    }

    // Use cachedProps while closing to retain the data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { open, onClose, ...restProps } = props.open ? props : cachedProps;

    return <Component {...(restProps as any)} onClose={props.onClose} open={props.open} />;
  };
