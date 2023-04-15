import { startTracking, trackParentActions } from "./action";
import { ActionContext, runActionInContext } from "./context";
import { Signal, SignalAccessor, SignalAccessorSymbol } from "./types";

export const signal = <T>(initialValue: T | (() => T)): Signal<T> => {
  let initialized = typeof initialValue !== "function";
  let currentValue: T | undefined = typeof initialValue !== "function" ? initialValue : undefined;
  let flush: () => void;

  const accessor = (() => {
    if (!initialized) {
      currentValue = (initialValue as () => T)();
      initialized = true;
    }

    flush = startTracking((track) => {
      runActionInContext((context) => {
        if (context.parentAction?.trackable) {
          track(context.parentAction);
        }
      });
    });

    return currentValue;
  }) as SignalAccessor<T>;

  accessor[SignalAccessorSymbol] = "SignalAccessor";

  const modifier = (nextValue: T) => {
    currentValue = nextValue;
    flush();
  };

  return [accessor, modifier];
};
