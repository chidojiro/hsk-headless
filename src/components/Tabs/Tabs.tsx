import { useControllable } from 'hooks';
import React from 'react';
import { Children } from 'types';
import { TabValue } from './Tab';
import { TabsProvider, TabsProviderValue } from './TabsProvider';

export type TabsProps = Children & {
  value?: TabValue;
  onChange?: (value: TabValue) => void;
};

export const Tabs = ({ value: valueProp, onChange, children }: TabsProps) => {
  const [value, setValue] = useControllable({ value: valueProp, onChange, defaultValue: 0 });
  const [content, setContent] = React.useState<React.ReactNode>();
  const tabsCountRef = React.useRef(-1);

  const increaseTabsCount = React.useCallback(() => {
    tabsCountRef.current = tabsCountRef.current + 1;

    return tabsCountRef.current;
  }, []);

  const providerValue = React.useMemo<TabsProviderValue>(
    () => ({ value, handleChange: setValue, content, setContent, tabsCount: tabsCountRef.current, increaseTabsCount }),
    [content, increaseTabsCount, setValue, value]
  );

  return <TabsProvider value={providerValue}>{children}</TabsProvider>;
};
