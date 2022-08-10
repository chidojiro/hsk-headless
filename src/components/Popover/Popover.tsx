import { useDelayableState, useOnEventOutside } from 'hooks';
import React, { useState } from 'react';
import { PopperProps, usePopper } from 'react-popper';
import { Children, OpenClose } from 'types';
import { AssertUtils } from 'utils';
import { ConditionalWrapper } from '../ConditionalWrapper';
import { Portal } from '../Portal';

export type PopoverPlacement = PopperProps<any>['placement'];

export type PopoverProps = Children &
  OpenClose & {
    placement?: PopoverPlacement;
    usePortal?: boolean;
    trigger: React.ReactElement | HTMLElement;
    offset?: [number, number];
  };

export const Popover = ({
  children,
  usePortal = true,
  trigger,
  placement = 'bottom-start',
  offset = [0, 8],
  open,
  onClose,
}: PopoverProps) => {
  const [triggerElement, setTriggerElement] = useState<React.ReactElement>();
  const popoverRef = React.useRef(null);

  // Workaround to resolve misalignment on initial render
  const [actuallyOpen, setActuallyOpen] = useDelayableState({ delayBy: 0, defaultState: false });

  const { styles, attributes, forceUpdate } = usePopper(
    AssertUtils.isHTMLElement(trigger) ? (trigger as any) : triggerElement,
    popoverRef.current,
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
    setActuallyOpen({ state: !!open, shouldDelay: true });
    forceUpdate?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, open, setActuallyOpen, (trigger as HTMLElement)?.innerHTML]);

  useOnEventOutside('click', [popoverRef, triggerElement as any], onClose);

  return (
    <>
      {clonedTrigger}
      <ConditionalWrapper conditions={[{ condition: usePortal, component: Portal as any }]}>
        <div ref={popoverRef} style={{ ...styles.popper, zIndex: 999 }} {...attributes.popper}>
          <div style={{ display: actuallyOpen ? 'block' : 'none' }}>{children}</div>
        </div>
      </ConditionalWrapper>
    </>
  );
};
