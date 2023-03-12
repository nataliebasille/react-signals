import { ContextAction } from './types';

let currentAction: ContextAction<void> | undefined = undefined;
export const getCurrentAction = () => {
  return currentAction;
};

export const runInContext = <T>(action: ContextAction<T>) => {
  let result: T = undefined as T;
  currentAction = () => {
    const previousAction = currentAction;
    result = action();
    currentAction = previousAction;
  };

  currentAction();

  return result as T;
};

const adHocFlush = (deps: readonly ContextAction[]) => {
  for (const action of deps) {
    action();
  }
};

let flushStrategy = adHocFlush;

export const trackParentActions = <TAction extends () => unknown>(action: TAction): [TAction, () => void] => {
  const trackedActions = new Set<ContextAction>();

  const actionWithTracking = (() => {
    const result = action();
    const depAction = getCurrentAction();

    if (depAction) {
      trackedActions.add(depAction);
    }
    return result;
  }) as TAction;

  const flush = () => {
    const dependentActionsToRun = [...trackedActions.values()];
    trackedActions.clear();
    flushStrategy(dependentActionsToRun);
  };

  return [actionWithTracking, flush];
};

export const batch = <T>(action: () => T) => {
  const previosuFlushStrategy = flushStrategy;
  const dependentActionsToRun = new Set<ContextAction>();
  flushStrategy = function batchFlush(deps) {
    deps.forEach((action) => dependentActionsToRun.add(action));
  };

  action();

  dependentActionsToRun.forEach((action) => {
    action();
  });

  flushStrategy = previosuFlushStrategy;
};
