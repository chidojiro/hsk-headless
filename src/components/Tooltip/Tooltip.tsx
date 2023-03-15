import { useDisclosure, useOnEventOutside } from '@/hooks';
import { OpenClose } from '@/types';
import { Children, cloneElement, ReactNode, useMemo, useRef } from 'react';
import { Popper, PopperProps } from '../Popper';

export type TooltipProps = Omit<PopperProps, 'trigger' | keyof OpenClose> & {
  content: ReactNode;
  children?: ReactNode;
};

export const Tooltip = ({ children, placement = 'top', content, ...restProps }: TooltipProps) => {
  const disclosure = useDisclosure();
  const triggerElementRef = useRef<any>();

  useOnEventOutside('mouseover', triggerElementRef, disclosure.close);

  const clonedTrigger = useMemo(() => {
    return Children.map(children, child =>
      cloneElement(child as any, {
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
    <Popper
      open={disclosure.isOpen}
      trigger={clonedTrigger as any}
      placement={placement}
      offset={[0, 8]}
      {...restProps}>
      {content}
    </Popper>
  );
};
