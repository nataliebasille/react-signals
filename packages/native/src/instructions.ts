import type { SignalAccessor } from "@natcore/signals-core";
import { JSXElement } from "./render";

export const InstructionSymbol = Symbol("Instruction");
export type FragmentInstruction = {
  type: "fragment";
  children: JSXElement[];
  [InstructionSymbol]: "FragmentInstruction";
};

export type ComponentInstruction = {
  type: "component";
  component: (props: unknown) => JSXElement;
  props: unknown;
  [InstructionSymbol]: "ComponentInstruction";
};

export type NativeInstruction = {
  type: "native";
  tag: string;
  props: Record<string, any>;
  children: JSXElement[];
  [InstructionSymbol]: "NativeInstruction";
};

export type SignalInstruction = {
  type: "signal";
  accessor: SignalAccessor<JSXElement>;
  [InstructionSymbol]: "SignalInstruction";
};

export type RenderInstruction = FragmentInstruction | ComponentInstruction | NativeInstruction | SignalInstruction;

export const isInstruction = (value: unknown): value is RenderInstruction => {
  return typeof value === "object" && !!value && InstructionSymbol in value;
};
