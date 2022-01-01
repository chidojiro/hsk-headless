import React from 'react';
import { ComponentStory } from '@storybook/react';

import useOverlayingLoader from './useOverlayingLoader';

export default {
  title: 'Hooks/useOverlayingLoader',
};

const Template: ComponentStory<any> = ({ active, hostWidth, hostHeight }: any) => {
  const ref = React.useRef<HTMLDivElement>(null);

  useOverlayingLoader({
    active,
    host: ref,
    overlayingLoader: <div className='flex items-center justify-center w-full h-full'>Loading...</div>,
  });

  return <div className='bg-gray-300' style={{ width: hostWidth, height: hostHeight }} ref={ref}></div>;
};

export const Basic = Template.bind({});
Basic.args = {
  active: false,
  hostWidth: '100vw',
  hostHeight: '100vh',
};
