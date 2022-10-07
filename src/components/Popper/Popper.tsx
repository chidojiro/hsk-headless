import { useOnEventOutside } from '@/hooks';
import { OpenClose } from '@/types';
import { AssertUtils } from '@/utils';
import React, { useState } from 'react';
import { PopperProps as ReactPopperProps, usePopper } from 'react-popper';
import { Portal } from '../Portal';

export type PopperPlacement = ReactPopperProps<any>['placement'];

const originalError = console.error;

export type PopperProps = Omit<OpenClose, 'defaultOpen'> & {
  placement?: PopperPlacement;
  trigger: React.ReactElement | HTMLElement;
  offset?: [number, number];
  children?: React.ReactNode | ((props: { triggerElement: Element | undefined }) => React.ReactNode);
};

export const Popper = ({
  children,
  trigger,
  placement = 'bottom-start',
  offset = [0, 4],
  open,
  onClose,
}: PopperProps) => {
  const [triggerElement, setTriggerElement] = useState<Element>();
  const PopperRef = React.useRef(null);

  const { styles, attributes, forceUpdate } = usePopper(
    AssertUtils.isHTMLElement(trigger) ? (trigger as any) : triggerElement,
    PopperRef.current,
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

  React.useLayoutEffect(() => {
    console.error = e => {
      if (e.toString().includes('flushSync')) return '';

      return e;
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  const clonedTrigger = React.useMemo(() => {
    if (!trigger || AssertUtils.isHTMLElement(trigger)) return null;

    return React.Children.map(trigger, child =>
      React.cloneElement(child, {
        ref: (node: Element) => {
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

  React.useEffect(() => {
    forceUpdate?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, open, (trigger as HTMLElement)?.innerHTML]);

  useOnEventOutside('click', [PopperRef, triggerElement as any], onClose);

  return (
    <>
      {clonedTrigger}
      <Portal>
        <div
          ref={PopperRef}
          style={{
            ...styles.popper,
            zIndex: 999,
            display: open ? 'block' : 'none',
          }}
          {...attributes.popper}>
          {typeof children === 'function' ? children({ triggerElement }) : children}
        </div>
      </Portal>
    </>
  );
};
