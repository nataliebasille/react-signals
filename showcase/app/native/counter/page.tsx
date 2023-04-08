"use client";
import { createElement, useEffect, useRef } from "react";

import { effect, signal } from "@natcore/signals-core";

const setup = () => {
  const playButton = document.createElement("button");
  playButton.className =
    "focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900";
  const [counter, setCounter] = signal(0);
  const [running, setRunning] = signal(true);

  playButton.onclick = () => {
    setRunning(!running());
  };

  const countHtmlRenderDisposer = effect(() => {
    playButton.innerText = `${running() ? "Pause" : "Play"}: ${counter()}`;
  });

  const countIntervalDisposer = effect(() => {
    const id = running()
      ? setInterval(() => {
          setCounter(counter() + 1);
        }, 1000)
      : undefined;

    return () => {
      if (id) {
        clearInterval(id);
      }
    };
  });

  return [[playButton], [countHtmlRenderDisposer, countIntervalDisposer]] as const;
};

export default function NativeClockPage() {
  return <div>Native clock page</div>;
}
