import { signal } from "@natcore/signals-core";
import { SignalNode } from "..";
import { render, screen } from "@testing-library/react";
import { useEffect } from "react";

describe("SignalNode", () => {
  it("signal change only rerenders node it's attached too", () => {
    const renderedChecker = jest.fn();
    const [value, setValue] = signal(0);
    const TestComponent = () => {
      renderedChecker();
      useEffect(() => {
        setValue(1);
      }, []);
      return <SignalNode signal={value} />;
    };

    render(<TestComponent />);
    expect(renderedChecker).toHaveBeenCalledTimes(1);
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
