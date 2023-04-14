import { getCurrentAction } from "./context";

export const untrack = <T>(action: () => T): T => {
  const currentAction = getCurrentAction();
  const tempTrackable = currentAction?.trackable ?? false;

  if (currentAction) {
    currentAction.trackable = false;
  }

  const value = action();

  if (currentAction) {
    currentAction.trackable = tempTrackable;
  }

  return value;
};
