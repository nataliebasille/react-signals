import { trackParentActions } from './action';
import { Signal } from './types';

export const signal = <T>(initialValue: T | (() => T)): Signal<T> => {
  let initialized = typeof initialValue !== 'function';
  let currentValue: T | undefined = typeof initialValue !== 'function' ? initialValue : undefined;

  const [accessor, flush] = trackParentActions(() => {
    if (!initialized) {
      currentValue = (initialValue as () => T)();
      initialized = true;
    }
    return currentValue as T;
  });

  const modifier = (nextValue: T) => {
    currentValue = nextValue;
    flush();
  };

  return [accessor, modifier];
};
