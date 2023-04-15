import { createTracker } from "./tracking";
import { runActionInContext } from "./context";
import { SignalAccessor, SignalAccessorSymbol } from "./types";

export const computed = <T>(action: () => T): SignalAccessor<T> => {
  let currentValue: T;
  const flush = createTracker();
  let accessorDispose = () => {};
  runActionInContext(() => {
    currentValue = action();
    accessorDispose();
  }, "computed evaluator");

  const accessor = (() => {
    accessorDispose = runActionInContext((context) => {
      if (context.parentAction?.trackable) {
        flush.track(context.parentAction);
      }

      context.registerCleanup(() => {
        flush();
      });
    }, "computed accessor");

    return currentValue;
  }) as SignalAccessor<T>;

  accessor[SignalAccessorSymbol] = "SignalAccessor";

  return accessor;
};
