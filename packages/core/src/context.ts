export type ActionContext<T = unknown> = {
  (owner?: ActionContext<unknown>): T;
  readonly childActions: readonly ActionContext[];
  readonly parentAction: ActionContext | undefined;
  readonly registerCleanup: (cleanup: () => void) => void;
  readonly dispose: () => void;
  readonly disposeChildActions: () => void;
  trackable: boolean;
};

type Mutable<T> = { -readonly [P in keyof T]: T[P] };

let uuid = 0;
let currentActionContext: ActionContext<unknown> | undefined = undefined;
export function runActionInContext<T>(action: (context: ActionContext) => T, type: string): () => void {
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

  const context = function (owner?: ActionContext<unknown>) {
    if (disposed) return;
    cleanup();
    const parentAction = arguments.length > 0 ? owner : getCurrentAction();
    if (parentAction) {
      (context as Mutable<ActionContext<T>>).parentAction = parentAction;
      (parentAction.childActions as Array<any>).push(context);
    }
    const previousAction = currentActionContext;
    currentActionContext = context;
    const result = action(context);
    currentActionContext = previousAction;
    return result;
  } as ActionContext<T>;

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    cleanup();
    (context as Mutable<ActionContext<T>>).parentAction = undefined;
  };

  (context as any)._id = ++uuid;
  (context as any)._type = type;
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
  return currentActionContext;
};
