import { useControllable } from 'hooks';
import noop from 'lodash/noop';
import React from 'react';
import { Children } from 'types';
import { Content } from './Content';
import { Item } from './Item';

export type Props = Children & {
  index?: number;
  onChange?: (index: number) => void;
};

type TabsProvider = {
  handleChange: (index: number) => void;
  index?: number;
  content?: React.ReactNode;
  setContent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  tabsCount: number;
  increaseTabsCount: () => number;
};

export const TabsContext = React.createContext<TabsProvider>({
  index: undefined,
  handleChange: noop,
  content: undefined,
  setContent: noop,
  tabsCount: 0,
  increaseTabsCount: () => -1,
});

export const Tabs = ({ index: indexProp, onChange, children }: Props) => {
  const [index, setIndex] = useControllable({ value: indexProp, onChange, defaultValue: 0 });
  const [content, setContent] = React.useState<React.ReactNode>();
  const tabsCountRef = React.useRef(-1);

  const increaseTabsCount = React.useCallback(() => {
    tabsCountRef.current = tabsCountRef.current + 1;

    return tabsCountRef.current;
  }, []);

  const providerValue: TabsProvider = React.useMemo(
    () => ({ index, handleChange: setIndex, content, setContent, tabsCount: tabsCountRef.current, increaseTabsCount }),
    [content, increaseTabsCount, setIndex, index]
  );

  return <TabsContext.Provider value={providerValue}>{children}</TabsContext.Provider>;
};

Tabs.Item = Item;
Tabs.Content = Content;
