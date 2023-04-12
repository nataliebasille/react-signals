import { SignalAccessorSymbol, computed, effect, isSignalAccessor } from "@natcore/signals-core";
import {
  ComponentInstruction,
  FragmentInstruction,
  InstructionSymbol,
  NativeInstruction,
  RenderInstruction,
  SignalInstruction,
  isInstruction,
} from "./instructions";

export const render = (jsx: JSX.Element, root: Node) => {
  renderNode(jsx, root);

  return () => {
    removeChildNodes(root);
  };
};

export const renderNode = (jsx: JSX.Element, parent: Node) => {
  isInstruction(jsx)
    ? jsx.type === "component"
      ? renderComponentNode(jsx, parent)
      : jsx.type === "native"
      ? renderNativeNode(jsx, parent)
      : jsx.type === "signal"
      ? renderSignalNode(jsx, parent)
      : renderFragmentNode(jsx, parent)
    : renderPrimativeNode(jsx, parent);
};

function renderPrimativeNode(jsx: Exclude<JSX.Element, RenderInstruction>, parent: Node) {
  if (typeof jsx === "function" && isSignalAccessor(jsx)) {
    renderSignalNode(
      {
        type: "signal",
        accessor: jsx,
        [InstructionSymbol]: "SignalInstruction",
      },
      parent
    );
    return;
  }
  const node = document.createTextNode(jsx?.toString() ?? "");
  parent.appendChild(node);
}

function renderComponentNode({ component, props }: ComponentInstruction, parent: Node) {
  const result = component(props);
  renderNode(result, parent);
}

function renderNativeNode({ tag, props, children }: NativeInstruction, parent: Node) {
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

  children.forEach((child) => {
    renderNode(child, node);
  });

  parent.appendChild(node);
}

function renderSignalNode({ accessor }: SignalInstruction, parent: Node) {
  effect(() => {
    removeChildNodes(parent);

    const value = accessor();

    if (isInstruction(value)) {
      renderNode(value, parent);
    } else {
      renderPrimativeNode(value, parent);
    }
  });
}

function renderFragmentNode({ children }: FragmentInstruction, parent: Node) {
  children.forEach((child) => {
    renderNode(child, parent);
  });
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
