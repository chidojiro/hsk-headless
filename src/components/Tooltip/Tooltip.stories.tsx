import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Tooltip } from './Tooltip';

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
} as ComponentMeta<typeof Tooltip>;

const Template: ComponentStory<typeof Tooltip> = args => (
  <div className='w-screen h-screen flex items-center justify-center'>
    <Tooltip {...args}>
      <button>Hover me</button>
    </Tooltip>
  </div>
);

export const Basic = Template.bind({});
Basic.args = { offset: [0, 8], content: 'I am a tooltip content' };
