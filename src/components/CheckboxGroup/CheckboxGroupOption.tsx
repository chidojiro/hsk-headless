import { useMountEffect } from '@/hooks';
import React, { ChangeEvent } from 'react';
import { useCheckboxGroupContext } from './CheckboxGroupProvider';

type RenderPropState = {
  value: string;
  isChecked: boolean;
  error?: boolean;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
};

export type CheckboxGroupOptionProps = {
  value: string;
  error?: boolean;
  shouldChange?: (e: ChangeEvent<HTMLInputElement>, checkboxGroupValue: string[]) => boolean | Promise<boolean>;
  children?: (state: RenderPropState) => React.ReactNode;
};

export const CheckboxGroupOption = ({ value, shouldChange: shouldChangeProp, children }: CheckboxGroupOptionProps) => {
  const groupProviderValue = useCheckboxGroupContext();

  const isChecked = groupProviderValue.value.includes(value);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = async e => {
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
