import { SignalAccessor } from "@natcore/signals-core";
import { useState } from "react";
import { useSignalEffect } from "./useSignalEffect";

export const SignalNode = <T extends unknown>({ signal }: { signal: SignalAccessor<T> }) => {
  const [value, setValue] = useState<T>(() => signal());

  useSignalEffect(() => {
    setValue(signal());
  });

  return <>{value}</>;
};
