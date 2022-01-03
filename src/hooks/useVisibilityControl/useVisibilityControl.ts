import React from 'react';

export type Control = {
  open: () => void;
  close: () => void;
  toggle: () => void;
  visible: boolean;
};

export type Props = {
  onClose?: () => void;
  onShow?: () => void;
};

export const useVisibilityControl = (props?: Props) => {
  const { onClose, onShow } = props || {};
  const [isActive, setIsActive] = React.useState(false);

  const open = React.useCallback(() => {
    setIsActive(true);
    onShow?.();
  }, [onShow]);

  const close = React.useCallback(() => {
    setIsActive(false);
    onClose?.();
  }, [onClose]);

  const toggle = React.useCallback(() => {
    setIsActive(prev => {
      if (prev) {
        onClose?.();
      } else {
        onShow?.();
      }

      return !prev;
    });
  }, [onClose, onShow]);

  return React.useMemo<Control>(() => ({ open, close, visible: isActive, toggle }), [open, close, isActive, toggle]);
};
