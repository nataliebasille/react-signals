import { trackParentActions } from "./action";
import { runActionInContext } from "./context";
import { SignalAccessor } from "./types";

export const computed = <T>(action: () => T): SignalAccessor<T> => {
  let currentValue: T;

  const [computedSignalAccessor, flush] = trackParentActions(() => {
    return currentValue;
  });

  runActionInContext(() => {
    currentValue = action();
    flush();
  });

  return computedSignalAccessor;
};
