import { Fn } from '@/types';
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react';

export type Disclosure = {
  set: Dispatch<SetStateAction<boolean>>;
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
  const [isOpen, setIsOpen] = useState(!!defaultOpen);

  const open = useCallback(() => {
    setIsOpen(true);
    onOpen?.();
  }, [onOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const toggle = useCallback(() => {
    setIsOpen(prev => {
      if (prev) {
        onClose?.();
      } else {
        onOpen?.();
      }

      return !prev;
    });
  }, [onClose, onOpen]);

  return useMemo<Disclosure>(() => ({ open, close, isOpen, toggle, set: setIsOpen }), [open, close, isOpen, toggle]);
};
