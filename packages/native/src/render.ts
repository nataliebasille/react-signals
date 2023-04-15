import { effect, isSignalAccessor, signal, untrack, zone } from "@natcore/signals-core";
import {
  ComponentInstruction,
  FragmentInstruction,
  InstructionSymbol,
  NativeInstruction,
  RenderInstruction,
  SignalInstruction,
  isInstruction,
} from "./instructions";

export type JSXElement = RenderInstruction | string | boolean | number | null | undefined | (() => JSXElement);

export const render = (jsx: () => JSXElement, root: Node) => {
  const dispose = zone(() => renderNode(jsx(), root));

  return () => {
    removeChildNodes(root);
    dispose();
  };
};

export const renderNode = (jsx: JSXElement, parent: Node, anchor?: Node): Node | undefined => {
  return isInstruction(jsx)
    ? jsx.type === "component"
      ? renderComponentNode(jsx, parent, anchor)
      : jsx.type === "native"
      ? renderNativeNode(jsx, parent, anchor)
      : jsx.type === "signal"
      ? renderSignalNode(jsx, parent, anchor)
      : renderFragmentNode(jsx, parent, anchor)
    : renderPrimativeNode(jsx, parent, anchor);
};

function renderPrimativeNode(
  jsx: Exclude<JSXElement, RenderInstruction>,
  parent: Node,
  anchor?: Node
): Node | undefined {
  if (typeof jsx === "function" && isSignalAccessor(jsx)) {
    return renderSignalNode(
      {
        type: "signal",
        accessor: jsx,
        [InstructionSymbol]: "SignalInstruction",
      },
      parent,
      anchor
    );
  }
  const node = document.createTextNode(jsx?.toString() ?? "");
  appendChild(parent, node, anchor);

  return node;
}

function renderComponentNode(
  { component, props }: ComponentInstruction,
  parent: Node,
  anchor?: Node
): Node | undefined {
  const result = component(props);
  return renderNode(result, parent, anchor);
}

function renderNativeNode({ tag, props, children }: NativeInstruction, parent: Node, anchor?: Node): Node | undefined {
  const node = document.createElement(tag);

  Object.entries(props).forEach(([key, value]) => {
    if (key === "style") {
      Object.entries(value as any).map(([styleKey, styleValue]) => {
        setupProperty(node.style, styleKey, styleValue);
      });
    } else if (key.indexOf("on") === 0) {
      (node as any)[key.toLowerCase()] = value;
    } else {
      setupProperty(node, key, value);
    }
  });

  renderFragmentNode({ type: "fragment", children, [InstructionSymbol]: "FragmentInstruction" }, node, anchor);

  appendChild(parent, node, anchor);
  return node;
}

function renderSignalNode({ accessor }: SignalInstruction, parent: Node, anchor?: Node): Node | undefined {
  let [node, setNode] = signal(anchor);
  effect(() => {
    const value = accessor();
    const currentNode = untrack(node);
    setNode(
      isInstruction(value) ? renderNode(value, parent, currentNode) : renderPrimativeNode(value, parent, currentNode)
    );
  });

  effect(() => {
    const currentNode = node();
    return () => {
      currentNode?.parentElement?.removeChild(currentNode);
    };
  });

  return node();
}

function renderFragmentNode({ children }: FragmentInstruction, parent: Node, anchor?: Node) {
  return children.reduce((prev, child) => {
    return renderNode(child, parent, prev);
  }, anchor);
}

function removeChildNodes(node: Node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

function setupProperty(node: object, key: string, value: any) {
  if (isSignalAccessor(value)) {
    effect(() => {
      (node as any)[key] = value();
    });
  } else {
    (node as any)[key] = value;
  }
}

function appendChild(parent: Node, child: Node, anchor?: Node) {
  if (anchor?.nextSibling) {
    parent.insertBefore(child, anchor.nextSibling);
  } else {
    parent.appendChild(child);
  }
}
