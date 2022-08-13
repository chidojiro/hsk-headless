import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AspectRatio } from './AspectRatio';

export default {
  title: 'Components/AspectRatio',
  component: AspectRatio,
} as ComponentMeta<typeof AspectRatio>;

const Template: ComponentStory<typeof AspectRatio> = args => <AspectRatio {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  ratio: '1/1',
  style: { width: '200px', backgroundColor: 'aliceblue' },
};

export const WithContent = Template.bind({});
WithContent.args = {
  ratio: '1/1',
  children:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  style: { width: '200px', backgroundColor: 'aliceblue' },
};
