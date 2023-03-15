import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Popper } from './Popper';

export default {
  title: 'Components/Popper',
  component: Popper,
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
} as ComponentMeta<typeof Popper>;

const Template: ComponentStory<typeof Popper> = args => (
  <div className='w-screen h-screen flex items-center justify-center'>
    <Popper {...args} trigger={<button>trigger</button>}>
      <div className='w-30 h-40 border border-black'>{args.children}</div>
    </Popper>
  </div>
);

export const Basic = Template.bind({});
Basic.args = { open: true, children: 'Popper content', offset: [0, 8] };
