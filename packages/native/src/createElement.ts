import { ComponentInstruction, InstructionSymbol, NativeInstruction, SignalInstruction } from "./instructions";
import { SignalAccessor, SignalAccessorSymbol } from "@natcore/signals-core";

type PossibleChildren = { children?: JSX.Element | JSX.Element[] };
export function createElement<TProps extends {}>(
  component: (props: TProps) => JSX.Element,
  props: TProps & PossibleChildren
): ComponentInstruction;
export function createElement<T>(signal: SignalAccessor<T>): SignalInstruction;
export function createElement(
  tag: string,
  props: {
    [key: string]: any;
  } & PossibleChildren
): NativeInstruction;

export function createElement(
  /** undefined represents a fragment */
  tagOrComponent: undefined | string | ((props: unknown) => JSX.Element) | SignalAccessor<JSX.Element>,
  props?: {
    [key: string]: any;
  } & PossibleChildren
): JSX.Element {
  props = props ?? {};
  const children =
    props?.children instanceof Array ? props.children : "children" in props && props.children ? [props.children] : [];

  if (!tagOrComponent) {
    return {
      type: "fragment",
      children,
      [InstructionSymbol]: "FragmentInstruction",
    };
  }

  if (typeof tagOrComponent === "string") {
    const { children: _, ...rest } = props;
    return {
      type: "native",
      tag: tagOrComponent,
      props: rest,
      children,
      [InstructionSymbol]: "NativeInstruction",
    };
  }

  if (SignalAccessorSymbol in tagOrComponent) {
    return {
      type: "signal",
      accessor: tagOrComponent,
      [InstructionSymbol]: "SignalInstruction",
    };
  }

  return {
    type: "component",
    component: tagOrComponent,
    props,
    [InstructionSymbol]: "ComponentInstruction",
  };
}
