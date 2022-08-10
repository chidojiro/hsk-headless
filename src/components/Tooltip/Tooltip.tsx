import { useDisclosure, useOnEventOutside } from 'hooks';
import React from 'react';
import { Children, OpenClose } from 'types';
import { Popover } from '../Popover';
import { PopoverProps } from '../Popover/Popover';

export type TooltipProps = Omit<PopoverProps, 'trigger' | keyof OpenClose> &
  Children & {
    content: React.ReactNode;
  };

export const Tooltip = ({ children, placement = 'top', content, ...restProps }: TooltipProps) => {
  const disclosure = useDisclosure();
  const triggerElementRef = React.useRef<any>();

  useOnEventOutside('mouseover', triggerElementRef, disclosure.close);

  const clonedTrigger = React.useMemo(() => {
    return React.Children.map(children, child =>
      React.cloneElement(child as any, {
        ref: (node: Element) => {
          triggerElementRef.current = node;

          if (node) {
            node.addEventListener('mouseenter', disclosure.open);
          }

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
  }, [disclosure, children]);

  // Do not show popover yet to avoid dom mutation
  if (!disclosure.isOpen) return <>{clonedTrigger}</>;

  return (
    <Popover
      open={disclosure.isOpen}
      trigger={clonedTrigger as any}
      placement={placement}
      offset={[0, 8]}
      {...restProps}>
      {content}
    </Popover>
  );
};
