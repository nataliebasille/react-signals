"use client";

import { SignalAccessor, SignalNode, useComputedSignal, useSignal } from "@natcore/signals-react";
import { useEffect } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const timestamp = () => {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();

  return {
    hours: hours % 12 || 12,
    minutes,
    seconds,
    milliseconds,
    am: hours < 12,
  };
};

const AnimatedNode = ({ value }: { value: SignalAccessor<number | string> }) => {
  const [ref] = useAutoAnimate<HTMLSpanElement>({
    easing: "ease-in",
  });
  const node = useComputedSignal(() => <span key={value()}>{value()}</span>);

  return (
    <span ref={ref}>
      <SignalNode signal={node} />
    </span>
  );
};
const DigitalClock = ({ time }: { time: SignalAccessor<ReturnType<typeof timestamp>> }) => {
  console.log("DigitalClock - rendered");
  const [ref] = useAutoAnimate<HTMLDivElement>();

  const secondsOnes = useComputedSignal(() => {
    const { seconds } = time();
    return seconds % 10;
  });
  const secondsTens = useComputedSignal(() => {
    const { seconds } = time();
    return Math.floor(seconds / 10);
  });
  const minutesOnes = useComputedSignal(() => {
    const { minutes } = time();
    return minutes % 10;
  });
  const minutesTens = useComputedSignal(() => {
    const { minutes } = time();
    return Math.floor(minutes / 10);
  });
  const hours = useComputedSignal(() => {
    const { hours } = time();
    return hours;
  });
  const ampm = useComputedSignal(() => {
    const { am } = time();
    return am ? "A" : "P";
  });
  return (
    <div className="flex font-mono text-8xl" ref={ref}>
      <AnimatedNode value={hours} />
      :
      <AnimatedNode value={minutesTens} />
      <AnimatedNode value={minutesOnes} />
      :
      <AnimatedNode value={secondsTens} />
      <AnimatedNode value={secondsOnes} />
      <span className="ml-4">
        <AnimatedNode value={ampm} />M
      </span>
    </div>
  );
};

export function Clock() {
  const [time, setTime] = useSignal(timestamp);

  useEffect(() => {
    let cancelled = false;
    const tick = () => {
      setTime(timestamp());
      if (!cancelled) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <DigitalClock time={time} />
    </div>
  );
}
