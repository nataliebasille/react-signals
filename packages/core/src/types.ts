export const SignalAccessorSymbol = Symbol("SignalAccessor");
export type SignalAccessor<T> = {
  (): T;
  [SignalAccessorSymbol]: "SignalAccessor";
};
export type SignalModifier<T> = (newValue: T) => void;
export type Signal<T> = [SignalAccessor<T>, SignalModifier<T>];
export type SignalSourceSubscriber<T> = (nextValue: T) => void;
export type SignalSourceUnsubscriber = () => void;
export type SignalSource<T> = {
  subscribe(subscriber: SignalSourceSubscriber<T>): SignalSourceUnsubscriber;
};
export type ContextAction<T = unknown> = {
  (): T;
  childActions: ContextAction[];
  cleanup?: () => void;
};

export function isSignalAccessor(value: unknown): value is SignalAccessor<unknown>;
export function isSignalAccessor<T>(fn: () => T): fn is SignalAccessor<T>;
export function isSignalAccessor(value: unknown): value is SignalAccessor<unknown> {
  return typeof value === "function" && SignalAccessorSymbol in value;
}
