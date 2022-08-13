import { ReactUtils } from '@/utils';
import { TabValue } from './Tab';

export type TabsProviderValue = {
  handleChange: (value: TabValue) => void;
  value?: TabValue;
  content?: React.ReactNode;
  setContent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  tabsCount: number;
  increaseTabsCount: () => number;
};

export const [TabsProvider, useTabsContext] = ReactUtils.createContext<TabsProviderValue>();
