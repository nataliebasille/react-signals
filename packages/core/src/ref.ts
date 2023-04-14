import { SignalAccessor, SignalAccessorSymbol } from "./types";
import { untrack } from "./untrack";

export const ref = <T>(action: () => T) => {
  const refSignal = (() => untrack(action)) as SignalAccessor<T>;
  refSignal[SignalAccessorSymbol] = "SignalAccessor";
  return refSignal;
};
