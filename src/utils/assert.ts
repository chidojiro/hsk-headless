import ldIsFunction from 'lodash/isFunction';
import ldIsArray from 'lodash/isArray';
import ldIsNull from 'lodash/isNull';
import ldIsUndefined from 'lodash/isUndefined';
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

const AssertUtils = { isRef, isArray, isFunction, isObject, isNull, isUndefined, isNullOrUndefined };

export default AssertUtils;
