import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Popover } from './Popover';

export default {
  title: 'Components/Popover',
  component: Popover,
  argTypes: {
    trigger: {
      control: {
        disable: true,
      },
    },
    open: {
      control: {
        disable: true,
      },
    },
  },
} as ComponentMeta<typeof Popover>;

const Template: ComponentStory<typeof Popover> = args => (
  <div className='w-screen h-screen flex items-center justify-center'>
    <Popover {...args} trigger={<button>trigger</button>}>
      <div className='w-30 h-40 border border-black'>{args.children}</div>
    </Popover>
  </div>
);

export const Basic = Template.bind({});
Basic.args = { open: true, children: 'Popover content', offset: [0, 8] };
