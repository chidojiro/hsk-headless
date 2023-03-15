import { useControllableState } from '@/hooks';
import { Children } from '@/types';
import { ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import { TabValue } from './Tab';
import { TabsProvider, TabsProviderValue } from './TabsProvider';

export type TabsProps = Children & {
  value?: TabValue;
  onChange?: (value: TabValue) => void;
};

export const Tabs = ({ value: valueProp, onChange, children }: TabsProps) => {
  const [value, setValue] = useControllableState({ value: valueProp, onChange, defaultValue: 0 });
  const [content, setContent] = useState<ReactNode>();
  const tabsCountRef = useRef(-1);

  const increaseTabsCount = useCallback(() => {
    tabsCountRef.current = tabsCountRef.current + 1;

    return tabsCountRef.current;
  }, []);

  const providerValue = useMemo<TabsProviderValue>(
    () => ({ value, handleChange: setValue, content, setContent, tabsCount: tabsCountRef.current, increaseTabsCount }),
    [content, increaseTabsCount, setValue, value]
  );

  return <TabsProvider value={providerValue}>{children}</TabsProvider>;
};
