import React from 'react';
import { TabsContext } from '../Tabs';

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

// eslint-disable-next-line no-empty-pattern
export const Content = ({}: Props) => {
  const { content } = React.useContext(TabsContext);

  return <>{content}</>;
};
