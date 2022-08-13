import { ReactUtils } from '@/utils';

export type RadioGroupProviderValue = {
  value?: string;
  handleChange: (value: string) => void;
};

export const [RadioGroupProvider, useRadioGroupContext] = ReactUtils.createContext<RadioGroupProviderValue>();
