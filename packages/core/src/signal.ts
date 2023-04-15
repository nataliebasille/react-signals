import { createTracker } from "./tracking";
import { runActionInContext } from "./context";
import { Signal, SignalAccessor, SignalAccessorSymbol } from "./types";

export const signal = <T>(initialValue: T | (() => T)): Signal<T> => {
  let initialized = typeof initialValue !== "function";
  let currentValue: T | undefined = typeof initialValue !== "function" ? initialValue : undefined;
  const flush = createTracker();
  const accessor = (() => {
    if (!initialized) {
      currentValue = (initialValue as () => T)();
      initialized = true;
    }

    const dispose = runActionInContext((context) => {
      if (context.parentAction?.trackable) {
        flush.track(context.parentAction);
      }
    });

    dispose();

    return currentValue;
  }) as SignalAccessor<T>;

  accessor[SignalAccessorSymbol] = "SignalAccessor";

  const modifier = (nextValue: T) => {
    currentValue = nextValue;
    flush();
  };

  return [accessor, modifier];
};
