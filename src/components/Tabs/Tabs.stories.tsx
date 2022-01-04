import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Tabs } from '.';
import classNames from 'classnames';

export default {
  title: 'Components/Tabs',
  component: Tabs,
} as ComponentMeta<typeof Tabs>;

const Template: ComponentStory<typeof Tabs> = args => (
  <Tabs>
    <div className='flex items-center gap-2'>
      <Tabs.Item content='Tab 1 Content'>
        {({ isActive, onClick }) => (
          <button className={classNames({ 'bg-cyan-200': isActive })} onClick={onClick}>
            Tab 1
          </button>
        )}
      </Tabs.Item>
      <Tabs.Item content='Tab 2 Content'>
        {({ isActive, onClick }) => (
          <button className={classNames({ 'bg-cyan-200': isActive })} onClick={onClick}>
            Tab 2
          </button>
        )}
      </Tabs.Item>
      <Tabs.Item content='Tab 3 Content'>
        {({ isActive, onClick }) => (
          <button className={classNames({ 'bg-cyan-200': isActive })} onClick={onClick}>
            Tab 3
          </button>
        )}
      </Tabs.Item>
    </div>
    <div className='mt-5'>
      <Tabs.Content />
    </div>
  </Tabs>
);

export const Basic = Template.bind({});
Basic.args = {};
