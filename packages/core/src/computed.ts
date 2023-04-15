import { startTracking, trackParentActions } from "./action";
import { runActionInContext } from "./context";
import { SignalAccessor, SignalAccessorSymbol } from "./types";

export const computed = <T>(action: () => T): SignalAccessor<T> => {
  let recompute = true;
  let currentValue: T;
  const accessor = (() => {
    const flush = startTracking((track) => {
      runActionInContext((context) => {
        if (recompute) {
          currentValue = action();
        }
        if (context.parentAction?.trackable) {
          track(context.parentAction);
        }
        recompute = false;
        context.registerCleanup(() => {
          recompute = true;
          flush();
        });
      });
    });

    return currentValue;
  }) as SignalAccessor<T>;

  accessor[SignalAccessorSymbol] = "SignalAccessor";

  return accessor;
};
