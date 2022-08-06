import React from 'react';
import ReactDOM from 'react-dom';
import { v4 as UUID } from 'uuid';
import { AssertUtils } from 'utils';
import { useWindowState } from 'hooks';
import { NotificationList } from './NotificationList';
import cloneDeep from 'lodash/cloneDeep';

type VerticalAlignment = 'top' | 'bottom';
type HorizontalAlignment = 'left' | 'right' | 'center';

export type Placement = `${VerticalAlignment}-${HorizontalAlignment}`;

export type Props = {
  closeOnUnmount?: boolean;
  closeAfter?: number | null;
  asChildOf?: React.RefObject<HTMLElement> | Element | null;
  placement?: Placement;
  className?: string;
  offsetX?: number | string;
  offsetY?: number | string;
  offsetEach?: number | string;
};

type RenderProps = {
  open?: boolean;
  handleClose: () => void;
};

type OpenOptions = {
  render: (props: RenderProps) => React.ReactNode;
};

export const NOTIFICATION_CONTAINER_ID = 'hsk-notification-container';

const NOTIFICATION_DEFAULT_TIMEOUT = 5000;

export const useNotification = (props?: Props) => {
  const {
    closeOnUnmount = true,
    closeAfter = NOTIFICATION_DEFAULT_TIMEOUT,
    placement = 'top-center',
    className = '',
    asChildOf = document.body,
    offsetEach = '0.5rem',
    offsetX = '1rem',
    offsetY = '1rem',
  } = props || {};
  const [allNotifications, setAllNotifications] = useWindowState<Record<string, OpenOptions>>(
    `allNotifications_${placement}`,
    {}
  );
  const ownNotificationIdsRef = React.useRef<string[]>([]);
  const [openingNotifications, setOpeningNotifications] = useWindowState<string[]>(
    `openingNotifications_${placement}`,
    []
  );
  const closeTimeoutsRef = React.useRef<NodeJS.Timeout[]>([]);

  const notificationListId = `notification-list__${placement}`;

  const getParent = React.useCallback(() => {
    if (AssertUtils.isRef(asChildOf)) return asChildOf.current;

    return asChildOf;
  }, [asChildOf]);

  React.useEffect(() => {
    let notificationContainer = document.getElementById(NOTIFICATION_CONTAINER_ID);

    if (!notificationContainer) {
      notificationContainer = document.createElement('div');
      notificationContainer.id = NOTIFICATION_CONTAINER_ID;

      notificationContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 9999;
        pointer-events: none;
      `;

      getParent()?.appendChild(notificationContainer);
    }

    let notificationList = document.getElementById(notificationListId);

    if (!notificationList) {
      notificationList = document.createElement('div');
      notificationList.id = notificationListId;
      notificationList.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      `;

      notificationContainer.appendChild(notificationList);
    }
  }, [className, getParent, notificationListId, offsetEach, offsetX, offsetY, placement]);

  const close = React.useCallback(
    (closedId: string) => {
      setOpeningNotifications(prev => prev.filter(id => id !== closedId));
    },
    [setOpeningNotifications]
  );

  const open = React.useCallback(
    (options: OpenOptions) => {
      const notificationId = UUID();

      setOpeningNotifications(prev => [...prev, notificationId]);
      ownNotificationIdsRef.current.push(notificationId);
      setAllNotifications(prev => ({ ...prev, [notificationId]: options }));

      if (closeAfter) {
        closeTimeoutsRef.current.push(
          setTimeout(() => {
            close(notificationId);
          }, closeAfter)
        );
      }

      return notificationId;
    },
    [close, closeAfter, setAllNotifications, setOpeningNotifications]
  );

  React.useEffect(
    () => () => {
      closeTimeoutsRef.current.forEach(timeout => {
        clearTimeout(timeout);
      });

      if (closeOnUnmount) {
        setAllNotifications(prev => {
          const clonePrev = cloneDeep(prev);

          ownNotificationIdsRef.current.forEach(id => {
            delete clonePrev[id];
          });

          return clonePrev;
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  React.useEffect(() => {
    ReactDOM.render(
      <NotificationList placement={placement} offsetEach={offsetEach} offsetX={offsetX} offsetY={offsetY}>
        {Object.keys(allNotifications).map(id => (
          <React.Fragment key={id}>
            {/* // TODO: performance with handleClose */}
            {allNotifications[id].render({ open: openingNotifications.includes(id), handleClose: () => close(id) })}
          </React.Fragment>
        ))}
      </NotificationList>,
      document.getElementById(notificationListId)
    );
  }, [allNotifications, close, notificationListId, offsetEach, offsetX, offsetY, openingNotifications, placement]);

  return React.useMemo(() => ({ open, close }), [close, open]);
};
