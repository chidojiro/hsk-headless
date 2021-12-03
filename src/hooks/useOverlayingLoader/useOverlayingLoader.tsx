import ReactDOM from 'react-dom';
import { v4 as UUID } from 'uuid';
import styled from 'styled-components';
import { AssertUtils } from 'utils';
import React from 'react';

type Configs = {
  active: boolean;
  host: React.RefObject<HTMLElement> | HTMLElement | null;
  loader?: React.ReactNode;
};

const StyledOverlayingSpinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const OVERLAYING_SPINNER_CLASS_NAME = 'hsk-overlaying-spinner';
const OVERLAYING_SPINNER_DATA_SPINNER_IDS = 'data-spinnerids';

const useOverlayingLoader = ({ active, host: hostProp, loader = 'loading...' }: Configs) => {
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
        width: 100%;
        height: 100%;
        z-index: 99999;
        background-color: #fff;
        opacity: 50%;
        pointer-event: none;
      `;
      registerSpinnerId();

      host.appendChild(overlayingSpinnerContainer);

      ReactDOM.render(<StyledOverlayingSpinner>{loader}</StyledOverlayingSpinner>, overlayingSpinnerContainer);
    } else {
      unregisterSpinnerId();
    }
  }, [active, getOverlayingSpinnerContainer, registerSpinnerId, loader, unregisterSpinnerId, getHostElement]);

  React.useLayoutEffect(() => {
    return () => {
      unregisterSpinnerId();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useOverlayingLoader;
