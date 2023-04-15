import { effect } from "./effect";
import { untrack } from "./untrack";

export const zone = (action: () => void): (() => void) => {
  return effect(() => {
    untrack(action);
  });
};
