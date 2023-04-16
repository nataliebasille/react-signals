import { SignalAccessor, effect, isSignalAccessor, signal, untrack, zone, ref, computed } from "@natcore/signals-core";
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

type AnchorSource = SignalAccessor<Node | undefined>;
export const render = (jsx: () => JSXElement, root: Node) => {
  const dispose = zone(() =>
    renderNode(
      jsx(),
      root,
      ref(() => undefined)
    )
  );

  return () => {
    removeChildNodes(root);
    dispose();
  };
};

export const renderNode = (jsx: JSXElement, parent: Node, anchor: AnchorSource): AnchorSource => {
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
  anchor: AnchorSource
): AnchorSource {
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
  appendChild(parent, node, anchor());

  return ref(() => node);
}

function renderComponentNode(
  { component, props }: ComponentInstruction,
  parent: Node,
  anchor: AnchorSource
): AnchorSource {
  const result = component(props);
  return renderNode(result, parent, anchor);
}

function renderNativeNode(
  { tag, props, children }: NativeInstruction,
  parent: Node,
  anchor: AnchorSource
): AnchorSource {
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

  appendChild(parent, node, anchor());
  return ref(() => node);
}

function renderSignalNode({ accessor }: SignalInstruction, parent: Node, anchor: AnchorSource): AnchorSource {
  let [endingNodeSource, setEndingNodeSource] = signal(() => anchor);
  effect(() => {
    const value = accessor();
    const endingNode = untrack(endingNodeSource);
    const nextEndingNode = isInstruction(value)
      ? renderNode(value, parent, endingNode)
      : renderPrimativeNode(value, parent, endingNode);
    setEndingNodeSource(nextEndingNode);
  });

  effect(() => {
    const last = endingNodeSource()();
    return () => {
      const start = anchor();
      let toRemove = last;
      while (parent.firstChild && toRemove && start !== toRemove) {
        const nextToRemove = toRemove?.previousSibling;
        parent.removeChild(toRemove);
        toRemove = nextToRemove ?? undefined;
      }
    };
  });

  return computed(() => endingNodeSource()());
}

function renderFragmentNode({ children }: FragmentInstruction, parent: Node, anchor: AnchorSource): AnchorSource {
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
