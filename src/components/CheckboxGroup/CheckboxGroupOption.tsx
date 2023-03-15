import { useMountEffect } from '@/hooks';
import { ChangeEvent, ChangeEventHandler, ReactNode } from 'react';
import { useCheckboxGroupContext } from './CheckboxGroupProvider';

type RenderPropState = {
  value: string;
  isChecked: boolean;
  error?: boolean;
  handleChange: ChangeEventHandler<HTMLInputElement>;
};

export type CheckboxGroupOptionProps = {
  value: string;
  error?: boolean;
  shouldChange?: (e: ChangeEvent<HTMLInputElement>, checkboxGroupValue: string[]) => boolean | Promise<boolean>;
  children?: (state: RenderPropState) => ReactNode;
};

export const CheckboxGroupOption = ({ value, shouldChange: shouldChangeProp, children }: CheckboxGroupOptionProps) => {
  const groupProviderValue = useCheckboxGroupContext();

  const isChecked = groupProviderValue.value.includes(value);

  const handleChange: ChangeEventHandler<HTMLInputElement> = async e => {
    const isChecked = e.target.checked;
    const value = e.target.value;

    const shouldChange = (await shouldChangeProp?.(e, groupProviderValue.value)) ?? true;

    if (shouldChange) {
      groupProviderValue?.handleChange(value, isChecked);
    }
  };

  useMountEffect(() => {
    groupProviderValue.registerValue(value);

    return () => groupProviderValue.unregisterValue(value);
  });

  return <>{children?.({ value, isChecked, handleChange, error: groupProviderValue.groupProps.error })}</>;
};
