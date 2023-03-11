import { createContext } from '@/utils';
import { RadioGroupProps } from './RadioGroup';

export type RadioGroupProviderValue = {
  value?: string;
  handleChange: (value: string) => void;
  groupProps?: RadioGroupProps;
};

export const [RadioGroupProvider, useRadioGroupContext] = createContext<RadioGroupProviderValue>();
