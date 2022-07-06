import ReactDOM from 'react-dom';
import classNames from 'classnames';
import React from 'react';
import { v4 as UUID } from 'uuid';

export type OverlayLoaderProps = {
  loading?: boolean;
  children: JSX.Element;
  loader: React.ReactElement;
};

const componentClassName = 'overlay-loader';

export const OverlayLoader = ({ loading, children, loader }: OverlayLoaderProps) => {
  const childrenRef = React.useRef<HTMLElement>(null);

  const clonedChildren = React.cloneElement(children, { ref: childrenRef });

  const idRef = React.useRef<string | null>();

  React.useEffect(() => {
    if (!childrenRef.current) return;

    if (loading) {
      const childrenPosition = window.getComputedStyle(childrenRef.current).position || 'static';

      if (childrenPosition === 'static') {
        childrenRef.current.style.setProperty('position', 'relative');
        childrenRef.current.style.setProperty('overflow', 'hidden');
      }

      const overlayLoader = document.createElement('div');
      overlayLoader.className = classNames(componentClassName, 'absolute flex justify-center inset-0 bg-black/10');
      idRef.current = overlayLoader.id = UUID();

      childrenRef.current.appendChild(overlayLoader);

      ReactDOM.render(loader, overlayLoader);
    } else if (idRef.current) {
      document.getElementById(idRef.current)?.remove();
      idRef.current = null;
    }

    return () => {
      if (idRef.current) {
        document.getElementById(idRef.current)?.remove();
        idRef.current = null;
      }
    };
  }, [loader, loading]);

  return <>{clonedChildren}</>;
};
