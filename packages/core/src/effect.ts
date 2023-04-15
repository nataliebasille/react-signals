import { batch } from "./tracking";
import { runActionInContext } from "./context";
import { ContextAction } from "./types";

export type EffectCleanup = () => void;
export type EffectDisposer = () => void;
export type EffectAction = () => void | EffectCleanup;
export const effect = (action: EffectAction): EffectDisposer => {
  return runActionInContext((myContext) => {
    batch(() => {
      const cleanup = action();

      if (cleanup) myContext.registerCleanup(cleanup);
    });
  }, "effect");
};
