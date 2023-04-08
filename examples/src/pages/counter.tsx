"use client";
import { useEffect, useState } from "react";
import { SignalNode, useSignal } from "@natcore/signals-react";
import Highlight from "react-highlight";
import Head from "next/head";

function CounterWithUseState() {
  console.log("CounterWithUseState - rendered");

  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((count) => count + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return <>{count}</>;
}

function CounterWithSignal() {
  console.log("CounterWithSignal - rendered");

  const [count, setCount] = useSignal(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count() + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return <SignalNode signal={count} />;
}

const counterWithUseStateText = `function CounterWithUseState() {
  console.log('CounterWithUseState - rendered');

  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count => count + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    }
  }, [])

  return <>{count}</>
}
`;

const counterWithUseSignalText = `function CounterWithSignal() {
  console.log("CounterWithSignal - rendered");

  const [count, setCount] = useSignal(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count() + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return <SignalNode signal={count} />;
}
`;

export default function Counter() {
  return (
    <>
      <Head>
        <title>Signal Examples</title>
        <meta name="description" content="Counters - signals vs useState" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/a11y-dark.css" />
      </Head>

      <div className="m-3 flex flex-col items-center">
        <div className="flex">
          <div>
            <Highlight className="language-typescript">{counterWithUseStateText}</Highlight>
          </div>
          <div className="ml-4 flex w-1/3 items-center justify-items-center font-mono text-8xl">
            <CounterWithUseState />
          </div>
        </div>
        <div className="divider">vs</div>
        <div className="flex">
          <Highlight className="language-typescript">{counterWithUseSignalText}</Highlight>
          <div className="ml-4 flex w-1/3 items-center justify-items-center font-mono text-8xl">
            <CounterWithSignal />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 text-lg font-bold">
        * Open the console to see which components are rerendering!
      </div>
    </>
  );
}
