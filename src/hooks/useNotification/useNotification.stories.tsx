import React from 'react';
import { ComponentStory } from '@storybook/react';

import { useNotification, Notification } from '.';

export default {
  title: 'Hooks/useNotification',
};

const Template: ComponentStory<any> = ({}: any) => {
  const notificationTopLeft = useNotification({ placement: 'top-left', closeOnUnmount: true });
  const notificationTopCenter = useNotification({ placement: 'top-center' });
  const notificationTopRight = useNotification({ placement: 'top-right' });
  const notificationBottomLeft = useNotification({ placement: 'bottom-left' });
  const notificationBottomCenter = useNotification({ placement: 'bottom-center' });
  const notificationBottomRight = useNotification({ placement: 'bottom-right' });

  return (
    <div className='flex items-center justify-center w-full h-[80vh]'>
      <div className='grid grid-cols-3 gap-2 w-[350px]'>
        <button
          onClick={() =>
            notificationTopLeft.open({
              render: ({ open }) =>
                open ? (
                  <Notification>
                    <div className='border border-gray-200 border-solid'>Top Left Notification</div>
                  </Notification>
                ) : null,
            })
          }>
          top-left
        </button>
        <button
          onClick={() =>
            notificationTopCenter.open({
              render: ({ open }) =>
                open ? (
                  <Notification>
                    <div className='border border-gray-200 border-solid'>Top Center Notification</div>
                  </Notification>
                ) : null,
            })
          }>
          top-center
        </button>
        <button
          onClick={() =>
            notificationTopRight.open({
              render: ({ open }) =>
                open ? (
                  <Notification>
                    <div className='border border-gray-200 border-solid'>Top Right Notification</div>
                  </Notification>
                ) : null,
            })
          }>
          top-right
        </button>

        <button
          onClick={() =>
            notificationBottomLeft.open({
              render: ({ open }) =>
                open ? (
                  <Notification>
                    <div className='border border-gray-200 border-solid'>Bottom Left Notification</div>
                  </Notification>
                ) : null,
            })
          }>
          bottom-left
        </button>
        <button
          onClick={() =>
            notificationBottomCenter.open({
              render: ({ open }) =>
                open ? (
                  <Notification>
                    <div className='border border-gray-200 border-solid'>Bottom Center Notification</div>
                  </Notification>
                ) : null,
            })
          }>
          bottom-center
        </button>
        <button
          onClick={() =>
            notificationBottomRight.open({
              render: ({ open }) =>
                open ? (
                  <Notification>
                    <div className='border border-gray-200 border-solid'>Bottom Right Notification</div>
                  </Notification>
                ) : null,
            })
          }>
          bottom-right
        </button>
      </div>
    </div>
  );
};

export const Basic = Template.bind({});
Basic.args = {};
