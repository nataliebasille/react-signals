import { signal, Signal } from '@nataliebasille/signals-core';
import { useRef } from 'react';

export const useSignal = <T>(initialValue: T | (() => T)) => {
  const ref = useRef<Signal<T> | undefined>(undefined);

  if(!ref.current) {
    ref.current = signal(initialValue);
  }

  return ref.current;
}