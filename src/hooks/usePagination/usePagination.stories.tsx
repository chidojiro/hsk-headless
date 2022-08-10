import { ComponentStory } from '@storybook/react';
import React from 'react';
import { usePagination, UsePaginationProps } from '.';
import clsx from 'clsx';

export default {
  title: 'Hooks/usePagination',
};

const Template: ComponentStory<any> = (props: UsePaginationProps) => {
  const { items } = usePagination(props);

  return (
    <div className='flex items-center gap-1'>
      {items.map(({ disabled, selected, type, onClick, page }, _idx) => (
        <button
          key={_idx}
          onClick={onClick}
          disabled={disabled}
          className={clsx('px-2', { 'border border-blue-500 border-solid': selected, 'opacity-50': disabled })}>
          {(() => {
            switch (type) {
              case 'ellipsis':
                return '...';
              case 'next':
                return 'next';
              case 'previous':
                return 'previous';
              case 'page':
                return page;
              default:
                return '';
            }
          })()}
        </button>
      ))}
    </div>
  );
};

export const Basic = Template.bind({});
Basic.args = {
  totalRecord: 100,
  perPage: 10,
  centerItemsCount: 3,
  sideItemsCount: 3,
};
