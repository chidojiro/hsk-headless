import React from 'react';
import { useTabsContext } from './TabsProvider';

// eslint-disable-next-line @typescript-eslint/ban-types
export type TabContentProps = {};

// eslint-disable-next-line no-empty-pattern
export const TabContent = ({}: TabContentProps) => {
  const { content } = useTabsContext();

  return <>{content}</>;
};
