import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useTabsContext } from './TabsProvider';

type TabItemRenderProp = (props: { onClick: () => void; isActive: boolean }) => ReactNode;

export type TabValue = number | string;

export type TabProps = JSX.IntrinsicElements['div'] & {
  children: TabItemRenderProp;
  content?: ReactNode;
  value?: TabValue;
};

export const Tab = ({ children, content, value }: TabProps) => {
  const [index, setIndex] = useState(-1);
  const { value: selectedValue, handleChange, setContent, increaseTabsCount } = useTabsContext();

  useEffect(() => {
    const index = increaseTabsCount();
    setIndex(index);
  }, [increaseTabsCount]);

  const onClick = useCallback(() => {
    handleChange(value ?? index);
  }, [handleChange, index, value]);

  const isActive = index === selectedValue || value === selectedValue;

  useEffect(() => {
    if (isActive) {
      setContent(content);
    }
  }, [content, isActive, setContent, index]);

  return <>{children({ onClick, isActive })}</>;
};
