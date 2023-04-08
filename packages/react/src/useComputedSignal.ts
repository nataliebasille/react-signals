import { computed, SignalAccessor } from "@natcore/signals-core";
import { useRef } from "react";

export const useComputedSignal = <T>(action: () => T) => {
  const ref = useRef<SignalAccessor<T> | undefined>(undefined);

  if (!ref.current) {
    ref.current = computed(action);
  }

  return ref.current;
};
