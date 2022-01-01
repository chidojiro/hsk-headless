import React, { ForwardedRef } from 'react';
import { UseOverlayingLoaderProps, useOverlayingLoader } from 'hooks';

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = Omit<UseOverlayingLoaderProps, 'host'> & { children: JSX.Element };

// eslint-disable-next-line no-empty-pattern
export const OverlayingLoader = React.forwardRef(
  ({ children, active, component }: Props, ref: ForwardedRef<HTMLElement>) => {
    const internalRef = React.useRef<HTMLElement>(null);

    React.useImperativeHandle(ref, () => internalRef.current as any);

    const clonedChildren = React.cloneElement(children, { ref: internalRef });

    useOverlayingLoader({ active, host: internalRef, component });

    return <>{clonedChildren}</>;
  }
);

OverlayingLoader.displayName = 'OverlayingLoader';
