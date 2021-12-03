import React from 'react';
import { ComponentStory } from '@storybook/react';

import useOverlayingLoader from './useOverlayingLoader';
import styled from 'styled-components';

export default {
  title: 'Hooks/useOverlayingLoader',
};

const StyledWrapper = styled.div`
  background: wheat;
`;

const Template: ComponentStory<any> = ({ active, hostWidth, hostHeight, loader }: any) => {
  const ref = React.useRef<HTMLDivElement>(null);

  useOverlayingLoader({ active, host: ref, loader });

  return <StyledWrapper style={{ width: hostWidth, height: hostHeight }} ref={ref}></StyledWrapper>;
};

export const Basic = Template.bind({});
Basic.args = {
  active: false,
  hostWidth: '100vw',
  hostHeight: '100vh',
  loader: 'Loading...',
};
