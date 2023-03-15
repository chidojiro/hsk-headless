import { isNull, isUndefined } from 'lodash-es';
import { ChangeEvent, RefObject } from 'react';

export const isRef = <T = Element>(target: unknown): target is RefObject<T> =>
  Object.prototype.hasOwnProperty.call(target, 'current');

export const isNullOrUndefined = (value: any): value is undefined | null => isNull(value) || isUndefined(value);

export const isObject = (data: unknown) => {
  return typeof data === 'object' && data !== null && !Array.isArray(data);
};

export const isChangeEvent = <T = any>(data: any): data is ChangeEvent<T> => {
  return data?.target && Object.prototype.hasOwnProperty.call(data?.target, 'value');
};

export const isHTMLElement = (data: any): data is HTMLElement => !!data?.tagName;
