import { ComponentStory } from '@storybook/react';
import React from 'react';
import { useNumberInput, UseNumberInputProps } from './useNumberInput';

export default {
  title: 'Hooks/useNumberInput',
};

const Component = ({ ...restProps }: UseNumberInputProps) => {
  const numberInputProps = useNumberInput({ ...restProps });
  return <input type='text' className='border' {...numberInputProps} />;
};

const Template: ComponentStory<typeof Component> = args => <Component {...args} />;

export const Uncontrolled = Template.bind({});
Uncontrolled.args = {
  separateThousands: true,
  allowNegative: true,
  pad: 0,
  defaultValue: '',
  max: 9999,
  min: -9999,
};

export const Controlled = Template.bind({});
Controlled.args = {
  separateThousands: true,
  allowNegative: true,
  pad: 0,
  value: '1000',
  max: 9999,
  min: -9999,
};
