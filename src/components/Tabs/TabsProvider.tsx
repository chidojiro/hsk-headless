import { createContext } from '@/utils';
import { Dispatch, ReactNode, SetStateAction } from 'react';
import { TabValue } from './Tab';

export type TabsProviderValue = {
  handleChange: (value: TabValue) => void;
  value?: TabValue;
  content?: ReactNode;
  setContent: Dispatch<SetStateAction<ReactNode>>;
  tabsCount: number;
  increaseTabsCount: () => number;
};

export const [TabsProvider, useTabsContext] = createContext<TabsProviderValue>();
