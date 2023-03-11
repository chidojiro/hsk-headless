import { useDisclosure, useOnEventOutside } from '@/hooks';
import { OpenClose } from '@/types';
import { isHTMLElement } from '@/utils';
import React, { useCallback, useState } from 'react';
import { PopperProps as RPPopperProps, usePopper } from 'react-popper';
import { Portal } from '../Portal';

export type PopperPlacement = RPPopperProps<any>['placement'];

export type PopperProps = Omit<OpenClose, 'defaultOpen'> & {
  placement?: PopperPlacement;
  trigger: React.ReactElement;
  offset?: [number, number];
  children?: React.ReactNode | ((props: { triggerElement: Element | undefined }) => React.ReactNode);
  usePortal?: boolean;
  closeOnClickOutside?: boolean;
  onToggle?: () => void;
};

export const Popper = ({
  children,
  /**
   * trigger if is a react component must forward ref to an html node
   */
  trigger,
  placement = 'bottom-start',
  offset = [0, 4],
  open: openProp,
  onClose,
  usePortal = true,
  closeOnClickOutside = true,
  onToggle,
}: PopperProps) => {
  const isControlled = openProp !== undefined;

  const [triggerElement, setTriggerElement] = useState<HTMLElement>();
  const [mainContentElement, setMainContentElement] = useState<HTMLDivElement | null>(null);

  const isOpenDisclosure = useDisclosure();

  const isOpen = openProp ?? isOpenDisclosure.isOpen;

  const handleClose = useCallback(() => {
    if (isControlled) {
      onClose?.();
    } else {
      isOpenDisclosure.close();
    }
  }, [isControlled, isOpenDisclosure, onClose]);

  const { styles, attributes } = usePopper(
    isHTMLElement(trigger) ? (trigger as any) : triggerElement,
    mainContentElement,
    {
      placement,
      modifiers: [
        {
          name: 'offset',
          options: {
            offset,
          },
        },
      ],
    }
  );

  console.error = e => {
    if (e.toString().includes('flushSync')) return '';

    return e;
  };

  React.useLayoutEffect(() => {
    const handleClick = () => {
      if (!isControlled) {
        isOpenDisclosure.toggle();
      } else {
        onToggle?.();
      }
    };

    triggerElement?.addEventListener('click', handleClick);

    return () => triggerElement?.removeEventListener('click', handleClick);
  }, [isControlled, isOpenDisclosure, onToggle, triggerElement]);

  // React.Children.map is used here to get the dom element from children which is a react node
  const clonedTrigger = React.useMemo(() => {
    return React.Children.map(trigger, child =>
      React.cloneElement(child, {
        ref: (node: HTMLElement) => {
          setTriggerElement(node);

          // Call the original ref, if any
          const { ref } = child as any;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref !== null) {
            ref.current = node;
          }
        },
      })
    );
  }, [trigger]);

  useOnEventOutside('click', closeOnClickOutside && isOpen && [mainContentElement, triggerElement as any], handleClose);

  React.useLayoutEffect(() => {
    const handleCloseOnEsc = (e: KeyboardEvent) => {
      if (e.code === 'Escape' && isOpen) {
        handleClose();
      }
    };

    window.addEventListener('keyup', handleCloseOnEsc);

    return () => window.removeEventListener('keyup', handleCloseOnEsc);
  }, [handleClose, isOpen]);

  const renderChildren = () => {
    if (!isOpen) return null;

    return typeof children === 'function' ? children({ triggerElement }) : children;
  };

  const mainContent = (
    <div
      ref={element => setMainContentElement(element)}
      style={{
        ...styles.popper,
      }}
      {...attributes.popper}>
      {renderChildren()}
    </div>
  );

  return (
    <>
      {clonedTrigger}
      {usePortal ? <Portal>{mainContent}</Portal> : mainContent}
    </>
  );
};
