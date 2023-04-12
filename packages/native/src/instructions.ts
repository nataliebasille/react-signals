import type { SignalAccessor } from "@natcore/signals-core";

export const InstructionSymbol = Symbol("Instruction");
export type FragmentInstruction = {
  type: "fragment";
  children: JSX.Element[];
  [InstructionSymbol]: "FragmentInstruction";
};

export type ComponentInstruction = {
  type: "component";
  component: (props: unknown) => JSX.Element;
  props: unknown;
  [InstructionSymbol]: "ComponentInstruction";
};

export type NativeInstruction = {
  type: "native";
  tag: string;
  props: Record<string, any>;
  children: JSX.Element[];
  [InstructionSymbol]: "NativeInstruction";
};

export type SignalInstruction = {
  type: "signal";
  accessor: SignalAccessor<JSX.Element>;
  [InstructionSymbol]: "SignalInstruction";
};

export type RenderInstruction = FragmentInstruction | ComponentInstruction | NativeInstruction | SignalInstruction;

export const isInstruction = (value: unknown): value is RenderInstruction => {
  return typeof value === "object" && !!value && InstructionSymbol in value;
};
