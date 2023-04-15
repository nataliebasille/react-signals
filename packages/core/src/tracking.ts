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

type Tracker = {
  (): void;
  track: (actionToTrack: ActionContext) => void;
};

export const createTracker = (): Tracker => {
  const deps = new Set<ActionContext>();
  const tracker = (() => {
    const depsToRun = [...deps.values()];
    deps.clear();
    flushStrategy(depsToRun);
  }) as Tracker;

  tracker.track = (actionToTrack) => {
    deps.add(actionToTrack);
  };

  return tracker;
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
