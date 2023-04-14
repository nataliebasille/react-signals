export type ActionContext<T = unknown> = {
  (): T;
  readonly childActions: readonly ActionContext[];
  readonly parentAction: ActionContext | undefined;
  readonly registerCleanup: (cleanup: () => void) => void;
  readonly dispose: () => void;
  readonly disposeChildActions: () => void;
  trackable: boolean;
};

type Mutable<T> = { -readonly [P in keyof T]: T[P] };

let uuid = 0;
const contextStack: ActionContext[] = [];
export function runActionInContext<T>(action: (context: ActionContext) => T): () => void {
  let ownCleanup: (() => void) | undefined = undefined;
  let disposed = false;
  const disposeChildActions = () => {
    context.childActions.forEach((action) => {
      action.dispose();
      (action as Mutable<ActionContext<T>>).parentAction = undefined;
    });
    (context as Mutable<ActionContext<T>>).childActions = [];
  };

  const cleanup = () => {
    ownCleanup?.();
    disposeChildActions();
  };

  const context = (() => {
    if (disposed) return;
    cleanup();
    const parent = getCurrentAction();
    if (parent) {
      (context as Mutable<ActionContext<T>>).parentAction = parent;
      (parent.childActions as Array<any>).push(context);
    }
    contextStack.push(context);
    const result = action(context);
    contextStack.pop();
    return result;
  }) as ActionContext<T>;

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    cleanup();
    (context as Mutable<ActionContext<T>>).parentAction = undefined;
  };

  (context as any)._id = ++uuid;
  (context as Mutable<ActionContext<T>>).trackable = true;
  (context as Mutable<ActionContext<T>>).childActions = [];
  (context as Mutable<ActionContext<T>>).dispose = dispose;
  (context as Mutable<ActionContext<T>>).disposeChildActions = disposeChildActions;
  (context as Mutable<ActionContext<T>>).registerCleanup = (cleanup) => {
    ownCleanup = cleanup;
  };

  context();

  return dispose;
}

export const getCurrentAction = () => {
  return contextStack[contextStack.length - 1];
};
