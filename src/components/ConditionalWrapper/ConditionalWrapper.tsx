import React from 'react';
import { Children } from 'types';

type Component = (props: any) => JSX.Element;

type BaseConfigOptions = {
  component: Component;
};

type IfConfig = BaseConfigOptions & {
  condition: boolean;
};

type ElseConfig = BaseConfigOptions;

type Configs = IfConfig[] | [...ifConfigs: IfConfig[], elseConfig: ElseConfig];

export type ConditionalWrapperProps = Children & {
  conditions: Configs;
} & Record<string, any>;

const getTruthyConfig = (configs: Configs) => {
  const lastConfig = configs[configs.length - 1];

  // If the last config is an "if" config, use its condition
  // Otherwise, just condition is true
  const lastConfigAsIfConfig = { ...lastConfig, condition: (lastConfig as IfConfig).condition ?? true };

  const unifiedConfigs = [...(configs.slice(0, configs.length - 1) as IfConfig[]), lastConfigAsIfConfig];

  for (const config of unifiedConfigs) {
    const { component, condition } = config;

    if (condition) return component;
  }

  // eslint-disable-next-line react/display-name
  return ({ children }: Children) => <>{children}</>;
};

export const ConditionalWrapper = ({ conditions, ...restProps }: ConditionalWrapperProps) => {
  const Component = getTruthyConfig(conditions);

  return <Component {...restProps} />;
};
