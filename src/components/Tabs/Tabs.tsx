import { useControllable } from 'hooks';
import noop from 'lodash/noop';
import React from 'react';
import { Children } from 'types';
import { Content } from './Content';
import { Item } from './Item';

type Value = number | string;

export type Props = Children & {
  value?: Value;
  onChange?: (value: Value) => void;
};

type TabsProvider = {
  handleChange: (value: Value) => void;
  value?: Value;
  content?: React.ReactNode;
  setContent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  tabsCount: number;
  increaseTabsCount: () => number;
};

export const TabsContext = React.createContext<TabsProvider>({
  value: undefined,
  handleChange: noop,
  content: undefined,
  setContent: noop,
  tabsCount: 0,
  increaseTabsCount: () => -1,
});

export const Tabs = ({ value: valueProp, onChange, children }: Props) => {
  const [value, setValue] = useControllable({ value: valueProp, onChange, defaultValue: 0 });
  const [content, setContent] = React.useState<React.ReactNode>();
  const tabsCountRef = React.useRef(-1);

  const increaseTabsCount = React.useCallback(() => {
    tabsCountRef.current = tabsCountRef.current + 1;

    return tabsCountRef.current;
  }, []);

  const providerValue: TabsProvider = React.useMemo(
    () => ({ value, handleChange: setValue, content, setContent, tabsCount: tabsCountRef.current, increaseTabsCount }),
    [content, increaseTabsCount, setValue, value]
  );

  return <TabsContext.Provider value={providerValue}>{children}</TabsContext.Provider>;
};

Tabs.Item = Item;
Tabs.Content = Content;
