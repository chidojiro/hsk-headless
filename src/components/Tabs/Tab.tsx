import React from 'react';
import { HTMLDivProps } from '@/types';
import { useTabsContext } from './TabsProvider';

type TabItemRenderProp = (props: { onClick: () => void; isActive: boolean }) => React.ReactNode;

export type TabValue = number | string;

export type TabProps = HTMLDivProps & {
  children: TabItemRenderProp;
  content?: React.ReactNode;
  value?: TabValue;
};

export const Tab = ({ children, content, value }: TabProps) => {
  const [index, setIndex] = React.useState(-1);
  const { value: selectedValue, handleChange, setContent, increaseTabsCount } = useTabsContext();

  React.useEffect(() => {
    const index = increaseTabsCount();
    setIndex(index);
  }, [increaseTabsCount]);

  const onClick = React.useCallback(() => {
    handleChange(value ?? index);
  }, [handleChange, index, value]);

  const isActive = index === selectedValue || value === selectedValue;

  React.useEffect(() => {
    if (isActive) {
      setContent(content);
    }
  }, [content, isActive, setContent, index]);

  return <>{children({ onClick, isActive })}</>;
};
