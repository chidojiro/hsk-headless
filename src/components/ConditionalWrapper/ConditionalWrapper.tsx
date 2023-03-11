import React from 'react';

type Component = React.FunctionComponent<any> | keyof JSX.IntrinsicElements;

type BaseConfigOptions = {
  component: Component;
  props?: any;
};

type IfConfig = BaseConfigOptions & {
  if: boolean;
};

type ElseConfig = BaseConfigOptions;

type Configs = IfConfig[] | [...ifConfigs: IfConfig[], elseConfig: ElseConfig];

const FallbackComponent = (props: { children?: React.ReactNode }) => {
  return <React.Fragment>{props.children}</React.Fragment>;
};

export type ConditionalWrapperProps = {
  children?: React.ReactNode;
  conditions: Configs;
} & Record<string, any>;

const getTruthyConfig = (configs: Configs): IfConfig => {
  if (configs.length === 0) {
    return { if: true, component: FallbackComponent };
  }

  const lastConfig = configs[configs.length - 1];

  // If the last config is an "if" config, use its condition
  // If it's an "else" make the condition always true
  // So that "else" can always be found as the last option
  const lastConfigAsIfConfig = {
    ...lastConfig,
    if: (lastConfig as IfConfig).if ?? true,
  };

  const unifiedConfigs = [...(configs.slice(0, configs.length - 1) as IfConfig[]), lastConfigAsIfConfig];

  for (const config of unifiedConfigs) {
    if (config.if) {
      return config;
    }
  }

  return { if: true, component: FallbackComponent };
};

export const ConditionalWrapper = ({ conditions, ...commonProps }: ConditionalWrapperProps) => {
  const { component: Component, props = {} } = getTruthyConfig(conditions);

  return <Component {...commonProps} {...props} />;
};
