import { effect, EffectAction } from "@nataliebasille/signals-core";
import { useEffect } from "react";

export const useSignalEffect = (action: EffectAction) => {
  useEffect(() => {
    return effect(action);
  }, []);
}