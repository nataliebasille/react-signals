import { computed, signal } from "@natcore/signals-core";
import { render as natcoreRender } from "..";

describe("render", () => {
  const disposers: ReturnType<typeof natcoreRender>[] = [];
  const render: typeof natcoreRender = (...args) => {
    const dispose = natcoreRender(...args);
    disposers.push(dispose);
    return dispose;
  };

  beforeEach(() => {
    for (const dispose of disposers) {
      dispose();
    }
    disposers.length = 0;
  });

  it("can render native node", () => {
    render(<h1>Test</h1>, document.body);
    expect(document.body.innerHTML).toBe("<h1>Test</h1>");
  });

  it("can use signal as a component", () => {
    const [Value, setValue] = signal("Hello");
    render(
      <h1>
        <Value />
      </h1>,
      document.body
    );
    expect(document.body.innerHTML).toBe("<h1>Hello</h1>");

    setValue("World");
    expect(document.body.innerHTML).toBe("<h1>World</h1>");
  });

  it("can use computed as a component", () => {
    const [Value, setValue] = signal("Hello");
    const ComputedValue = computed(() => {
      return Value() + " World";
    });
    render(
      <h1>
        <ComputedValue />
      </h1>,
      document.body
    );
    expect(document.body.innerHTML).toBe("<h1>Hello World</h1>");

    setValue("World");
    expect(document.body.innerHTML).toBe("<h1>World World</h1>");
  });

  it("can use signal as a child", () => {
    const [value, setValue] = signal("Hello");
    render(<h1>{value}</h1>, document.body);
    expect(document.body.innerHTML).toBe("<h1>Hello</h1>");

    setValue("World");
    expect(document.body.innerHTML).toBe("<h1>World</h1>");
  });

  it("can use computed as child", () => {
    const [value, setValue] = signal("Hello");
    const computedValue = computed(() => {
      return value() + " World";
    });
    render(<h1>{computedValue}</h1>, document.body);
    expect(document.body.innerHTML).toBe("<h1>Hello World</h1>");

    setValue("World");
    expect(document.body.innerHTML).toBe("<h1>World World</h1>");
  });

  it("can set prop on html", () => {
    render(<input type="text" checked={true} />, document.body);
    const node = document.body.firstChild as HTMLInputElement;
    expect(node.checked).toBe(true);
  });

  it("can use signal for prop on html", () => {
    const [checked, setChecked] = signal(true);
    render(<input type="text" checked={checked} />, document.body);
    const node = document.body.firstChild as HTMLInputElement;
    expect(node.checked).toBe(true);

    setChecked(false);
    expect(node.checked).toBe(false);
  });

  it("can render a fragment", () => {
    render(
      <>
        <h1>Test</h1>
        <h2>Test</h2>
      </>,
      document.body
    );
    expect(document.body.innerHTML).toBe("<h1>Test</h1><h2>Test</h2>");
  });

  it("can render a component that returns a fragment", () => {
    const Test = () => {
      return (
        <>
          <h1>Test</h1>
          <h2>Test</h2>
        </>
      );
    };
    render(<Test />, document.body);
    expect(document.body.innerHTML).toBe("<h1>Test</h1><h2>Test</h2>");
  });

  it("component that use an external signal can have html updated", () => {
    const [value, setValue] = signal("Hello");
    const Test = () => {
      return <h1>{value}</h1>;
    };
    render(<Test />, document.body);
    expect(document.body.innerHTML).toBe("<h1>Hello</h1>");
    setValue("World");
    expect(document.body.innerHTML).toBe("<h1>World</h1>");
  });

  it("component with internal symbol can have html updated", () => {
    const Test = () => {
      const [value, setValue] = signal("Hello");
      return <h1 onClick={() => setValue("World")}>{value}</h1>;
    };
    render(<Test />, document.body);
    expect(document.body.innerHTML).toBe("<h1>Hello</h1>");
    document.body.firstChild!.dispatchEvent(new MouseEvent("click"));
    expect(document.body.innerHTML).toBe("<h1>World</h1>");
  });

  it("can render a signal that returns a node", () => {
    const [value, setValue] = signal(<h1>Hello</h1>);
    render(value, document.body);
    expect(document.body.innerHTML).toBe("<h1>Hello</h1>");
    setValue(<h1>World</h1>);
    expect(document.body.innerHTML).toBe("<h1>World</h1>");
  });

  it("can render a signal that returns a node as a component", () => {
    const [Value, setValue] = signal(<h1>Hello</h1>);
    render(<Value />, document.body);
    expect(document.body.innerHTML).toBe("<h1>Hello</h1>");
    setValue(<h1>World</h1>);
    expect(document.body.innerHTML).toBe("<h1>World</h1>");
  });

  it("can render a null as an empty node", () => {
    const Test = () => {
      return <h1>{null}</h1>;
    };
    render(<Test />, document.body);
    expect(document.body.innerHTML).toBe("<h1></h1>");
  });

  it("can render undefined as an empty node", () => {
    const Test = () => {
      return <h1>{undefined}</h1>;
    };
    render(<Test />, document.body);
    expect(document.body.innerHTML).toBe("<h1></h1>");
  });

  it("can render more than one signal has a child node", () => {
    const [value, setValue] = signal("Hello");
    const [value2, setValue2] = signal("World");
    render(
      <h1>
        {value}
        {value2}
      </h1>,
      document.body
    );
    expect(document.body.innerHTML).toBe("<h1>HelloWorld</h1>");
    setValue("World");
    expect(document.body.innerHTML).toBe("<h1>WorldWorld</h1>");
    setValue2("Hello");
    expect(document.body.innerHTML).toBe("<h1>WorldHello</h1>");
  });

  it("can render multiple fragments", () => {
    render(
      <>
        <>
          <h1>Test</h1>
          <h2>Test</h2>
        </>
        <>
          <h1>Test 2</h1>
          <h2>Test 2</h2>
          <h3>Test 2</h3>
        </>
      </>,
      document.body
    );

    expect(document.body.innerHTML).toBe("<h1>Test</h1><h2>Test</h2><h1>Test 2</h1><h2>Test 2</h2><h3>Test 2</h3>");
  });
});
