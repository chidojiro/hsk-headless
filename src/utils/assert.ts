import {
  isArray as ldIsArray,
  isFunction as ldIsFunction,
  isNull as ldIsNull,
  isUndefined as ldIsUndefined,
} from 'lodash-es';
import React from 'react';

const isRef = <T = Element>(target: unknown): target is React.RefObject<T> =>
  Object.prototype.hasOwnProperty.call(target, 'current');

const isArray = ldIsArray;
const isNull = ldIsNull;
const isUndefined = ldIsUndefined;

const isNullOrUndefined = (value: any): value is undefined | null => isNull(value) || isUndefined(value);

const isFunction = ldIsFunction;

const isObject = (data: unknown) => {
  return typeof data === 'object' && data !== null && !Array.isArray(data);
};

const isChangeEvent = <T = any>(data: any): data is React.ChangeEvent<T> => {
  return data?.target && Object.prototype.hasOwnProperty.call(data?.target, 'value');
};

const isHTMLElement = (data: any): data is HTMLElement => !!data?.tagName;

export const AssertUtils = {
  isRef,
  isArray,
  isFunction,
  isObject,
  isNull,
  isUndefined,
  isNullOrUndefined,
  isChangeEvent,
  isHTMLElement,
};
