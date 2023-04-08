import { effect, EffectAction } from "@natcore/signals-core";
import { useEffect } from "react";

export const useSignalEffect = (action: EffectAction) => {
  useEffect(() => {
    return effect(action);
  }, []);
};
