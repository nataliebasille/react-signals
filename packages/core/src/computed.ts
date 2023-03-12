import { runInContext, trackParentActions } from './action';
import { SignalAccessor } from './types';

export const computed = <T>(action: () => T): SignalAccessor<T> => {
  let currentValue: T;

  const [computedSignalAccessor, flush] = trackParentActions(() => {
    return currentValue;
  });

  runInContext(() => {
    currentValue = action();
    flush();
  });

  return computedSignalAccessor;
};
