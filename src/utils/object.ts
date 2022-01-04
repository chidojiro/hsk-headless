import { AssertUtils } from '.';

const withDefaultValue =
  <T = any>(defaultValues: T) =>
  (target: T): T => {
    const resolveCurrentValue = (target: any, defaultValues: any): any => {
      if ([null, undefined].includes(target)) return defaultValues;

      if (AssertUtils.isObject(target) && AssertUtils.isObject(defaultValues)) {
        return withDefaultValue(defaultValues)(target);
      }

      return target;
    };

    const keys = Object.keys(defaultValues);

    return keys.reduce((acc, cur) => {
      const currentTarget = (target as any)?.[cur];
      const currentDefaultValues = (defaultValues as any)[cur];

      return {
        ...acc,
        [cur]: resolveCurrentValue(currentTarget, currentDefaultValues),
      };
    }, target);
  };

export const ObjectUtils = { withDefaultValue };
