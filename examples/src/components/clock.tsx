'use client';

import { computed, signal, SignalAccessor, SignalNode, useComputedSignal, useSignal } from "@nataliebasille/signals-react";
import { useEffect } from "react";

const timestamp = () => {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();

  return {
    hours,
    minutes,
    seconds,
    milliseconds,
  };
};

const [time, setTime] = signal(timestamp);
const pad1Zero = (value: number) => (value < 10 ? `0${value}` : value);
const timeFormatted = computed(() => {
  const { hours, minutes, seconds } = time();
  return `${pad1Zero(hours)}:${pad1Zero(minutes)}:${pad1Zero(seconds)}`;
})

const DigitalClock = () => {
  return (
    <div className="font-mono text-8xl">
      <SignalNode signal={timeFormatted} />
    </div>
  );
};

export function Clock() {
  useEffect(() => {
    let cancelled = false;
    const tick = () => {
      setTime(timestamp());
      if(!cancelled) {
        setTimeout(() => {
          requestAnimationFrame(tick);
        }, 1000/60)
      }
    };

    requestAnimationFrame(tick);

    return () => {
      cancelled = true;
    };
  }, []);

  return <DigitalClock />;
}
