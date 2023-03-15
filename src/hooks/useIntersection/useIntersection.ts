import { useDisclosure } from '@/hooks';
import { HTMLElementOrHTMLElementRef } from '@/types';
import { isRef } from '@/utils';
import { useEffect } from 'react';

export const useIntersection = (
  elementOrElementRef?: HTMLElementOrHTMLElementRef | null,
  rootMargin?: string
): boolean => {
  const element = isRef<HTMLElement>(elementOrElementRef) ? elementOrElementRef.current : elementOrElementRef;

  const intersectedDisclosure = useDisclosure();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        intersectedDisclosure.set(entry.isIntersecting);
      },
      { rootMargin }
    );

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [element, intersectedDisclosure, rootMargin]);

  return intersectedDisclosure.isOpen;
};
