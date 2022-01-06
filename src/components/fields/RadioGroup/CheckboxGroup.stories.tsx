import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { RadioGroup, RadioGroupProps } from '.';

export default {
  title: 'Components/RadioGroup',
  component: RadioGroup,
} as ComponentMeta<typeof RadioGroup>;

const renderRadioGroup = (props: RadioGroupProps) => (
  <RadioGroup {...props}>
    <div className='flex flex-col'>
      <RadioGroup.Option value='1'>
        {({ handleChange, isChecked, value }) => (
          <label>
            <input type='radio' value={value} checked={isChecked} onChange={handleChange} />
            Option 1
          </label>
        )}
      </RadioGroup.Option>
      <RadioGroup.Option value='2'>
        {({ handleChange, isChecked, value }) => (
          <label>
            <input type='radio' checked={isChecked} value={value} onChange={handleChange} />
            Option 2
          </label>
        )}
      </RadioGroup.Option>
      <RadioGroup.Option value='3'>
        {({ handleChange, isChecked, value }) => (
          <label>
            <input type='radio' checked={isChecked} value={value} onChange={handleChange} />
            Option 3
          </label>
        )}
      </RadioGroup.Option>
    </div>
  </RadioGroup>
);

const Template: ComponentStory<typeof RadioGroup> = args => renderRadioGroup(args);

export const Basic = Template.bind({});

export const Controlled = Template.bind({});
Controlled.args = { value: '2' };
