import { ComponentMeta, ComponentStory } from '@storybook/react';

import { ConditionalWrapper } from './ConditionalWrapper';

export default {
  title: 'Components/ConditionalWrapper',
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
  conditions: [{ if: true, component: 'div', props: { style: { padding: '20px', backgroundColor: 'aliceblue' } } }],
  children: (
    <div className='border border-border'>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
      magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
      consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </div>
  ),
};
