export type SignalAccessor<T> = () => T;
export type SignalModifier<T> = (newValue: T) => void;
export type Signal<T> = [SignalAccessor<T>, SignalModifier<T>];
export type SignalSourceSubscriber<T> = (nextValue: T) => void;
export type SignalSourceUnsubscriber = () => void;
export type SignalSource<T> = {
  subscribe(subscriber: SignalSourceSubscriber<T>): SignalSourceUnsubscriber;
};
export type ContextAction<T = unknown> = () => T;
