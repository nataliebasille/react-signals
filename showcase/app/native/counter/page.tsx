"use client";

import { useLayoutEffect, useRef } from "react";
import { render } from "@natcore/signals-native";
import { counter } from "@/components/native/counter";

export default function NativeCounterPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    return render(counter, containerRef.current!);
  }, []);

  return <div ref={containerRef} />;
}
