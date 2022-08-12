import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { RadioGroup, RadioGroupProps } from '.';
import { RadioGroupOption } from './RadioGroupOption';

export default {
  title: 'Components/RadioGroup',
  component: RadioGroup,
} as ComponentMeta<typeof RadioGroup>;

const renderRadioGroup = (props: RadioGroupProps) => (
  <RadioGroup {...props}>
    <div className='flex flex-col'>
      <RadioGroupOption value='1'>
        {({ handleChange, isChecked, value }) => (
          <label>
            <input type='radio' value={value} checked={isChecked} onChange={handleChange} />
            Option 1
          </label>
        )}
      </RadioGroupOption>
      <RadioGroupOption value='2'>
        {({ handleChange, isChecked, value }) => (
          <label>
            <input type='radio' checked={isChecked} value={value} onChange={handleChange} />
            Option 2
          </label>
        )}
      </RadioGroupOption>
      <RadioGroupOption value='3'>
        {({ handleChange, isChecked, value }) => (
          <label>
            <input type='radio' checked={isChecked} value={value} onChange={handleChange} />
            Option 3
          </label>
        )}
      </RadioGroupOption>
    </div>
  </RadioGroup>
);

const Template: ComponentStory<typeof RadioGroup> = args => renderRadioGroup(args);

export const Basic = Template.bind({});

export const Controlled = Template.bind({});
Controlled.args = { value: '2' };
