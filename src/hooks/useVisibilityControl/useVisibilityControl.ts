import React from 'react';

export type Control = {
  show: () => void;
  hide: () => void;
  toggle: () => void;
  visible: boolean;
};

export type Props = {
  onHide?: () => void;
  onShow?: () => void;
};

export const useVisibilityControl = (props?: Props) => {
  const { onHide, onShow } = props || {};
  const [isActive, setIsActive] = React.useState(false);

  const show = React.useCallback(() => {
    setIsActive(true);
    onShow?.();
  }, [onShow]);

  const hide = React.useCallback(() => {
    setIsActive(false);
    onHide?.();
  }, [onHide]);

  const toggle = React.useCallback(() => {
    setIsActive(prev => {
      if (prev) {
        onHide?.();
      } else {
        onShow?.();
      }

      return !prev;
    });
  }, [onHide, onShow]);

  return React.useMemo<Control>(() => ({ show, hide, visible: isActive, toggle }), [show, hide, isActive, toggle]);
};
