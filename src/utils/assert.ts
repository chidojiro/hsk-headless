import ldIsFunction from 'lodash/isFunction';
import ldIsArray from 'lodash/isArray';
import React from 'react';

const isRef = <T = Element>(target: unknown): target is React.RefObject<T> =>
  Object.prototype.hasOwnProperty.call(target, 'current');

const isArray = ldIsArray;

const isFunction = ldIsFunction;

const isObject = (data: unknown) => {
  return typeof data === 'object' && data !== null && !Array.isArray(data);
};

const AssertUtils = { isRef, isArray, isFunction, isObject };

export default AssertUtils;
