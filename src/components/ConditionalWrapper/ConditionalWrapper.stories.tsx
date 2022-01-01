import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ConditionalWrapper } from '.';

export default {
  title: 'ConditionalWrapper',
  component: ConditionalWrapper,
  argTypes: {
    component: {
      options: ['div'],
      control: 'select',
    },
  },
} as ComponentMeta<typeof ConditionalWrapper>;

const Template: ComponentStory<typeof ConditionalWrapper> = args => <ConditionalWrapper {...args} />;

export const AsDiv = Template.bind({});
AsDiv.args = {
  component: 'div',
  style: { padding: '20px', backgroundColor: 'aliceblue' },
  active: true,
  children: (
    <div className='border border-border'>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
      magna aliqua.
    </div>
  ),
};
