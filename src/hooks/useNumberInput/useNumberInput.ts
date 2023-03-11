import { useControllableState, useMountEffect } from '@/hooks';
import { isNullOrUndefined, trimZeroes } from '@/utils';
import { padStart } from 'lodash';
import React from 'react';
import { UseControllableStateProps } from '../useControllableState';

const numberPatterns = [/^-?\d*$/, /^-?\d+(\.(\d)*)?$/];

const isValidNumber = (num: string) => numberPatterns.some(pattern => pattern.test(num.toString().replace(/,/g, '')));

export type UseNumberInputProps = Omit<
  UseControllableStateProps<string, React.ChangeEvent<HTMLInputElement>>,
  'defaultValue'
> & {
  separateThousands?: boolean;
  allowNegative?: boolean;
  min?: number;
  max?: number;
  pad?: number;
  defaultValue?: string;
};

export const useNumberInput = ({
  separateThousands,
  allowNegative = true,
  min,
  max,
  defaultValue,
  onChange,
  value: valueProp,
  pad: padProp = 0,
}: UseNumberInputProps) => {
  const [_value, setValue] = useControllableState({ defaultValue: defaultValue ?? '', onChange, value: valueProp });

  // Accept 1 as the minimum value when value is negative
  // So that we have '-0' instead of just '-'
  const pad = _value.startsWith('-') && padProp === 0 ? 1 : padProp;

  const paddedValue = padStart(trimZeroes(_value).toString(), pad, '0');

  const guardInvalid = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>(e => {
    const value = e.target.value;
    if (!isValidNumber(value)) {
      throw new Error();
    }
  }, []);

  const guardNegative = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    e => {
      const value = e.target.value;

      if (!allowNegative && e.target.value.includes('-')) {
        throw new Error();
      }

      if (allowNegative && e.target.value === '-') {
        e.target.value = '-0';
        setValue({ internal: '-0', external: e });
        throw new Error();
      }

      if (allowNegative && (e.nativeEvent as any).data === '-') {
        if (value.startsWith('-')) {
          e.target.value = value.replace(/-/g, '');
        } else e.target.value = '-' + value.replace(/-/g, '');

        setValue({ internal: e.target.value, external: e });
        throw new Error();
      }
    },
    [allowNegative, setValue]
  );

  const guardLeadingZeroes = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    e => {
      const value = e.target.value;
      const zerosTrimmedEvenValue = padStart(value, pad, '0');
      e.target.value = zerosTrimmedEvenValue;
    },
    [pad]
  );

  const guardMinMax = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    e => {
      const value = e.target.value;

      const zerosTrimmedValue = padStart(value, pad, '0');
      const separatorTrimmedValue = zerosTrimmedValue.replace(/,/g, '');

      if (!isNullOrUndefined(min) && +separatorTrimmedValue < min) {
        const guardedValue = min?.toString() ?? '';
        e.target.value = guardedValue;
        setValue({ internal: guardedValue, external: e });
        throw new Error();
      }

      if (!isNullOrUndefined(max) && +separatorTrimmedValue > max) {
        const guardedValue = max?.toString() ?? '';
        e.target.value = guardedValue;
        setValue({ internal: guardedValue, external: e });
        throw new Error();
      }
    },
    [max, min, pad, setValue]
  );

  useMountEffect(() => {
    const e = { target: { value: _value } } as any;
    try {
      guardNegative(e);
      guardInvalid(e);
      guardLeadingZeroes(e);
    } catch {
      //
    }
  });

  const handleChange = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    e => {
      try {
        guardNegative(e);
        guardInvalid(e);
        guardLeadingZeroes(e);
      } catch {
        return;
      }

      if (separateThousands) {
        try {
          const targetValueWithoutSeparator = (e.target.value = e.target.value.replace(/,/g, ''));

          setValue({ internal: targetValueWithoutSeparator, external: e });
        } catch {
          //
        }

        return;
      }

      try {
        setValue({ internal: e.target.value, external: e });
      } catch {
        //
      }
    },
    [guardInvalid, guardLeadingZeroes, guardNegative, separateThousands, setValue]
  );

  const value = React.useMemo(() => {
    if (separateThousands) {
      const [whole, decimal] = paddedValue.split('.');
      const valueWithSeparator = [whole && padStart((+whole).toLocaleString(), pad, '0'), decimal]
        .filter(num => !isNullOrUndefined(num))
        .join('.');
      return valueWithSeparator;
    }

    return paddedValue;
  }, [pad, paddedValue, separateThousands]);

  const handleBlur = React.useCallback<React.FocusEventHandler<HTMLInputElement>>(
    e => {
      try {
        guardMinMax(e);
      } catch {
        //
      }
    },
    [guardMinMax]
  );

  return React.useMemo(
    () => ({ onChange: handleChange, value, onBlur: handleBlur }),
    [handleBlur, handleChange, value]
  );
};
