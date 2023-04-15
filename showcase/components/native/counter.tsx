import { computed, effect, signal } from "@natcore/signals-core";
import { JSXElement } from "@natcore/signals-native";

/** @jsxImportSource @natcore/signals-native */
export const counter = (): JSXElement => {
  const [count, setCount] = signal(0);
  const [playing, setPlaying] = signal(true);

  effect(() => {
    if (!playing()) return;

    const id = setInterval(() => {
      setCount(count() + 1);
    }, 1000);
    return () => clearInterval(id);
  });

  return (
    <button
      className="btn btn-primary"
      onClick={() => {
        setPlaying(!playing());
      }}
    >
      {computed(() => {
        return playing() ? "Pause" : "Play";
      })}
      : {count}
    </button>
  );
};
