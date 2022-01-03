import classNames from 'classnames';
import React from 'react';
import ReactDOM from 'react-dom';
import { Children } from 'types';
import { NotificationPlacement } from '.';

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = Children & {
  placement: NotificationPlacement;
  offsetEach?: number | string;
  offsetX?: number | string;
  offsetY?: number | string;
};

// eslint-disable-next-line no-empty-pattern
export const NotificationList = ({ children, placement, offsetEach, offsetX, offsetY }: Props) => {
  const [verticalAlignment, horizontalAlignment] = placement.split('-');

  React.useEffect(() => {
    ReactDOM.render(
      <div
        style={{ gap: offsetEach, padding: `${offsetX} ${offsetY}` }}
        className={classNames('flex w-full h-full', {
          'flex-col-reverse': verticalAlignment === 'bottom',
          'flex-col': verticalAlignment === 'top',
          'items-center': horizontalAlignment === 'center',
          'items-start': horizontalAlignment === 'left',
          'items-end': horizontalAlignment === 'right',
        })}>
        {children}
      </div>,
      document.getElementById(`notification-list__${placement}`)
    );
  }, [children, horizontalAlignment, offsetEach, offsetX, offsetY, placement, verticalAlignment]);

  return null;
};
