import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { CheckboxGroup, CheckboxGroupProps } from '.';

export default {
  title: 'Components/CheckboxGroup',
  component: CheckboxGroup,
} as ComponentMeta<typeof CheckboxGroup>;

const renderCheckboxGroup = (props: CheckboxGroupProps) => (
  <CheckboxGroup {...props}>
    <div className='flex flex-col'>
      <CheckboxGroup.Option value='1'>
        {({ handleChange, isChecked, value }) => (
          <label>
            <input type='checkbox' value={value} checked={isChecked} onChange={handleChange} />
            Option 1
          </label>
        )}
      </CheckboxGroup.Option>
      <CheckboxGroup.Option value='2'>
        {({ handleChange, isChecked, value }) => (
          <label>
            <input type='checkbox' checked={isChecked} value={value} onChange={handleChange} />
            Option 2
          </label>
        )}
      </CheckboxGroup.Option>
      <CheckboxGroup.Option value='3'>
        {({ handleChange, isChecked, value }) => (
          <label>
            <input type='checkbox' checked={isChecked} value={value} onChange={handleChange} />
            Option 3
          </label>
        )}
      </CheckboxGroup.Option>
    </div>
  </CheckboxGroup>
);

const Template: ComponentStory<typeof CheckboxGroup> = args => renderCheckboxGroup(args);

export const Basic = Template.bind({});

export const Controlled = Template.bind({});
Controlled.args = { value: ['1', '2'] };
