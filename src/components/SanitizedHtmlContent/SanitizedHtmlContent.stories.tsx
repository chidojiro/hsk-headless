import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SanitizedHtmlContent } from './SanitizedHtmlContent';

export default {
  title: 'Components/SanitizedHtmlContent',
  component: SanitizedHtmlContent,
} as ComponentMeta<typeof SanitizedHtmlContent>;

const Template: ComponentStory<typeof SanitizedHtmlContent> = args => <SanitizedHtmlContent {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: '<span style="color:blue">Hello world</span>',
};
