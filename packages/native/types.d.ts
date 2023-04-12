import { SignalAccessor } from "@natcore/signals-core";
import type { RenderInstruction } from "src/instructions";
declare global {
  namespace JSX {
    type Element = RenderInstruction | string | boolean | number | null | undefined | (() => Element);
    type IntrinsicElements = Record<string, any>;
  }
}
