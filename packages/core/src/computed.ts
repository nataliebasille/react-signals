import { createTracker } from "./tracking";
import { runActionInContext } from "./context";
import { SignalAccessor, SignalAccessorSymbol } from "./types";

export const computed = <T>(action: () => T): SignalAccessor<T> => {
  let recompute = true;
  let currentValue: T;
  const flush = createTracker();
  const accessor = (() => {
    runActionInContext((context) => {
      if (recompute) {
        currentValue = action();
      }
      if (context.parentAction?.trackable) {
        flush.track(context.parentAction);
      }
      recompute = false;
      context.registerCleanup(() => {
        recompute = true;
        flush();
      });
    });

    return currentValue;
  }) as SignalAccessor<T>;

  accessor[SignalAccessorSymbol] = "SignalAccessor";

  return accessor;
};
