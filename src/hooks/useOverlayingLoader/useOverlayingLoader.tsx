import ReactDOM from 'react-dom';
import { v4 as UUID } from 'uuid';
import { AssertUtils } from 'utils';
import React from 'react';

export type Props = {
  active: boolean;
  host: React.RefObject<HTMLElement> | HTMLElement | null;
  overlayingLoader?: React.ReactNode;
};

const OVERLAYING_SPINNER_CLASS_NAME = 'hsk-overlaying-spinner';
const OVERLAYING_SPINNER_DATA_SPINNER_IDS = 'data-spinnerids';

const useOverlayingLoader = ({ active, host: hostProp, overlayingLoader = 'loading...' }: Props) => {
  const idRef = React.useRef(UUID());

  const getHostElement = React.useCallback(() => {
    return AssertUtils.isRef(hostProp) ? hostProp.current : hostProp;
  }, [hostProp]);

  const getOverlayingSpinnerContainer = React.useCallback(
    () => getHostElement()?.getElementsByClassName(OVERLAYING_SPINNER_CLASS_NAME)[0],
    [getHostElement]
  );

  const registerSpinnerId = React.useCallback(() => {
    const foundSpinnerContainer = getOverlayingSpinnerContainer();
    if (!foundSpinnerContainer) return;

    const dataSpinnerIds = (foundSpinnerContainer.getAttribute(OVERLAYING_SPINNER_DATA_SPINNER_IDS) || '')
      .split(' ')
      .filter(Boolean);

    const newDataSpinnerIds = Array.from(new Set([...dataSpinnerIds, idRef.current]));

    foundSpinnerContainer.setAttribute(OVERLAYING_SPINNER_DATA_SPINNER_IDS, newDataSpinnerIds.join(' '));
  }, [getOverlayingSpinnerContainer]);

  const unregisterSpinnerId = React.useCallback(() => {
    const foundSpinnerContainer = getOverlayingSpinnerContainer();
    if (!foundSpinnerContainer) return;

    const dataSpinnerIds = (foundSpinnerContainer.getAttribute(OVERLAYING_SPINNER_DATA_SPINNER_IDS) || '')
      .split(' ')
      .filter(Boolean)
      .filter(id => id !== idRef.current)
      .join(' ');

    if (!dataSpinnerIds.length) foundSpinnerContainer.remove();

    foundSpinnerContainer.setAttribute(OVERLAYING_SPINNER_DATA_SPINNER_IDS, dataSpinnerIds);
  }, [getOverlayingSpinnerContainer]);

  React.useLayoutEffect(() => {
    const host = getHostElement();

    if (!host) return;

    if (active) {
      const foundSpinner = getOverlayingSpinnerContainer();

      if (foundSpinner) {
        registerSpinnerId();
        return;
      }

      const containerPosition = window.getComputedStyle(host).position || 'static';

      if (containerPosition === 'static') {
        host.style.setProperty('position', 'relative', 'important');
      }

      const overlayingSpinnerContainer = document.createElement('div');
      overlayingSpinnerContainer.classList.add(OVERLAYING_SPINNER_CLASS_NAME);
      overlayingSpinnerContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      `;
      registerSpinnerId();

      host.appendChild(overlayingSpinnerContainer);

      ReactDOM.render(<>{overlayingLoader}</>, overlayingSpinnerContainer);
    } else {
      unregisterSpinnerId();
    }
  }, [active, getOverlayingSpinnerContainer, registerSpinnerId, overlayingLoader, unregisterSpinnerId, getHostElement]);

  React.useLayoutEffect(() => {
    return () => {
      unregisterSpinnerId();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useOverlayingLoader;
