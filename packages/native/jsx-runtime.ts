import { JSXElement } from ".";
import { FragmentInstruction, InstructionSymbol } from "./src/instructions";

export { createElement as jsx, createElement as jsxs } from "./src/createElement";

export const Fragment = ({ children }: { children: JSXElement[] }): FragmentInstruction => {
  return {
    type: "fragment",
    children,
    [InstructionSymbol]: "FragmentInstruction",
  };
};
