import { SWRConfig } from 'swr';
import '../src/globals.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  Story => (
    <SWRConfig>
      <Story />
    </SWRConfig>
  ),
];
