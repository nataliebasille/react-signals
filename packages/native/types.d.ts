import { SignalAccessor } from "@natcore/signals-core";
import { JSXElement } from "src/render";

declare global {
  namespace JSX {
    type Element = JSXElement;
    type IntrinsicElements = Record<string, any>;
  }
}
