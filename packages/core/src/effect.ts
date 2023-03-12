import { batch, runInContext } from './action';

export type EffectCleanup = () => void;
export type EffectDisposer = () => void;
export type EffectAction = () => void | EffectCleanup;
export const effect = (action: EffectAction): EffectDisposer => {
  let actionToRun: EffectAction | undefined = action;
  let cleanup: EffectCleanup | undefined = undefined;

  runInContext(() => {
    batch(() => {
      cleanup?.();
      cleanup = actionToRun?.() || undefined;
    });
  });

  return () => {
    cleanup?.();
    actionToRun = undefined;
  };
};
