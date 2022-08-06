import React from 'react';
import { Fn } from 'types';

export type Disclosure = {
  set: React.Dispatch<React.SetStateAction<boolean>>;
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: boolean;
};

export type UseDisclosureProps = {
  defaultOpen?: boolean;
  onOpen?: Fn;
  onClose?: Fn;
};

export const useDisclosure = (props?: UseDisclosureProps) => {
  const { defaultOpen, onOpen, onClose } = props ?? {};
  const [isOpen, setIsOpen] = React.useState(!!defaultOpen);

  const open = React.useCallback(() => {
    setIsOpen(true);
    onOpen?.();
  }, [onOpen]);

  const close = React.useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const toggle = React.useCallback(() => {
    setIsOpen(prev => {
      if (prev) {
        onClose?.();
      } else {
        onOpen?.();
      }

      return !prev;
    });
  }, [onClose, onOpen]);

  return React.useMemo<Disclosure>(
    () => ({ open, close, isOpen, toggle, set: setIsOpen }),
    [open, close, isOpen, toggle]
  );
};
