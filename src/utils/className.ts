import { remove } from 'lodash';
import classNames, { Argument } from 'classnames';

// only keep the latest tailwindcss utility of a kind
// also integrate classnames to avoid boilerplate
const withTwReplaceable =
  (...patterns: string[]) =>
  (...args: Argument[]) => {
    const className = classNames(...args);

    const splitClassNames = className.split(/\s/);

    const classNamesAfterReplace = patterns.reduce((acc, cur) => {
      const lastOccurrenceIdx =
        acc.length -
        1 -
        acc
          .slice()
          .reverse()
          .findIndex(cls => cls.startsWith(cur));
      const safeClassNames = acc.slice(lastOccurrenceIdx);
      const trialClassNames = acc.slice(0, lastOccurrenceIdx);

      remove(trialClassNames, cls => cls.startsWith(cur));

      return [...trialClassNames, ...safeClassNames];
    }, splitClassNames);

    return classNamesAfterReplace.join(' ');
  };

export const ClassNameUtils = { withTwReplaceable: withTwReplaceable };
