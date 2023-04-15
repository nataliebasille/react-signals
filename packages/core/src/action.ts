import { ActionContext, getCurrentAction } from "./context";
import { SignalAccessorSymbol } from "./types";

type SignalAccessorForAction<TAction extends () => unknown> = TAction & {
  [SignalAccessorSymbol]: "SignalAccessor";
};

const adHocFlush = (deps: readonly ActionContext[]) => {
  for (const action of deps) {
    action();
  }
};

let flushStrategy = adHocFlush;
export const trackParentActions = <TAction extends () => unknown>(
  action: TAction
): [SignalAccessorForAction<TAction>, () => void] => {
  const trackedActions = new Set<ActionContext>();

  const actionWithTracking = (() => {
    const result = action();
    const depAction = getCurrentAction();
    if (depAction?.trackable) {
      trackedActions.add(depAction);
    }
    return result;
  }) as SignalAccessorForAction<TAction>;
  actionWithTracking[SignalAccessorSymbol] = "SignalAccessor";

  const flush = () => {
    const dependentActionsToRun = [...trackedActions.values()];
    trackedActions.clear();
    flushStrategy(dependentActionsToRun);
  };

  return [actionWithTracking, flush];
};

export const startTracking = (action: (track: (actionToTrack: ActionContext) => void) => void) => {
  const trackedActions = new Set<ActionContext>();

  action((actionToTrack) => {
    trackedActions.add(actionToTrack);
  });

  return () => {
    const dependentActionsToRun = [...trackedActions.values()];
    trackedActions.clear();
    flushStrategy(dependentActionsToRun);
  };
};

export const batch = <T>(action: () => T) => {
  const previosuFlushStrategy = flushStrategy;
  const dependentActionsToRun = new Set<ActionContext>();
  flushStrategy = function batchFlush(deps) {
    deps.forEach((action) => dependentActionsToRun.add(action));
  };

  action();

  dependentActionsToRun.forEach((action) => {
    action();
  });

  flushStrategy = previosuFlushStrategy;
};
