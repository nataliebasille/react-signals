import { untrack } from "./action";
import { SignalAccessor, SignalAccessorSymbol } from "./types";

export const ref = <T>(action: () => T) => {
  const refSignal = (() => untrack(action)) as SignalAccessor<T>;
  refSignal[SignalAccessorSymbol] = "SignalAccessor";
  return refSignal;
};
