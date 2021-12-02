import React from 'react';

export type Option<T = any> = {
  value: T;
  label: React.ReactNode;
};

export type ValueTransformProps<T = any> = {
  valueAs?: (value: T) => any;
  changeAs?: (value: any) => T;
};
