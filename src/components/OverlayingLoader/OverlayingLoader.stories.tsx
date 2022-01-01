import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { OverlayingLoader } from '.';
import { lorem } from 'consts';

export default {
  title: 'OverlayingLoader',
  component: OverlayingLoader,
} as ComponentMeta<typeof OverlayingLoader>;

const Template: ComponentStory<typeof OverlayingLoader> = args => (
  <OverlayingLoader
    {...args}
    component={<div className='flex items-center justify-center w-full h-full'>Loading...</div>}>
    <div className='w-[500px] h-[500px] bg-gray-300 opacity-50'>{lorem}</div>
  </OverlayingLoader>
);

export const AsDiv = Template.bind({});
AsDiv.args = {
  active: false,
};
