import { useDelayableState, useOnEventOutside } from '@/hooks';
import React, { useState } from 'react';
import { PopperProps as ReactPopperProps, usePopper } from 'react-popper';
import { Children, OpenClose } from '@/types';
import { AssertUtils } from '@/utils';
import { ConditionalWrapper } from '../ConditionalWrapper';
import { Portal } from '../Portal';

export type PopperPlacement = ReactPopperProps<any>['placement'];

export type PopperProps = Children &
  Omit<OpenClose, 'defaultOpen'> & {
    placement?: PopperPlacement;
    usePortal?: boolean;
    trigger: React.ReactElement | HTMLElement;
    offset?: [number, number];
  };

export const Popper = ({
  children,
  usePortal = true,
  trigger,
  placement = 'bottom-start',
  offset = [0, 8],
  open,
  onClose,
}: PopperProps) => {
  const [triggerElement, setTriggerElement] = useState<React.ReactElement>();
  const popperRef = React.useRef(null);

  // Workaround to resolve misalignment on initial render
  const [delayedOpen, setDelayedOpen] = useDelayableState({ delayBy: 0, defaultState: false });

  const { styles, attributes, forceUpdate } = usePopper(
    AssertUtils.isHTMLElement(trigger) ? (trigger as any) : triggerElement,
    popperRef.current,
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

  const clonedTrigger = React.useMemo(() => {
    if (!trigger || AssertUtils.isHTMLElement(trigger)) return null;

    return React.Children.map(trigger, child =>
      React.cloneElement(child, {
        ref: (node: React.ReactElement) => {
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
    setDelayedOpen({ state: !!open, shouldDelay: true });
    forceUpdate?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, open, setDelayedOpen, (trigger as HTMLElement)?.innerHTML]);

  useOnEventOutside('click', [popperRef, triggerElement as any], onClose);

  return (
    <>
      {clonedTrigger}
      <ConditionalWrapper conditions={[{ if: usePortal, component: Portal as any }]}>
        <div
          ref={popperRef}
          style={{ ...styles.popper, zIndex: 999, display: delayedOpen ? 'block' : 'none' }}
          {...attributes.popper}>
          {children}
        </div>
      </ConditionalWrapper>
    </>
  );
};
