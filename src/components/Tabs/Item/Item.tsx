import React from 'react';
import { HTMLDivProps } from 'types';
import { TabsContext } from '../Tabs';

type TabItemRenderProp = (props: { onClick: () => void; isActive: boolean }) => React.ReactNode;

export type Props = HTMLDivProps & {
  children: TabItemRenderProp;
  content?: React.ReactNode;
};

export const Item = ({ children, content }: Props) => {
  const [index, setIndex] = React.useState(-1);
  const { index: selectedIndex, handleChange, setContent, increaseTabsCount } = React.useContext(TabsContext);

  React.useEffect(() => {
    const index = increaseTabsCount();
    setIndex(index);
  }, [increaseTabsCount]);

  const onClick = React.useCallback(() => {
    handleChange(index);
  }, [handleChange, index]);

  const isActive = index === selectedIndex;

  React.useEffect(() => {
    if (isActive) {
      setContent(content);
    }
  }, [content, isActive, setContent, index]);

  return <div>{children({ onClick, isActive })}</div>;
};
