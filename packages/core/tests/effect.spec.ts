import { computed, effect, signal } from "..";

describe("effect", () => {
  it("runs when initalized", () => {
    const callback = jest.fn();
    effect(callback);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("reruns when dependent signal changes", () => {
    const [value, setValue] = signal(0);
    const callback = jest.fn();
    const dispose = effect(() => {
      value();
      callback();
    });

    setValue(2);
    expect(callback).toHaveBeenCalledTimes(2);
    dispose();
  });

  it("reruns when a dependent computed signal changes", () => {
    const [value, setValue] = signal(0);
    const computedValue = computed(() => value() + 1);
    const callback = jest.fn();
    const dispose = effect(() => {
      computedValue();
      callback();
    });

    setValue(2);
    expect(callback).toHaveBeenCalledTimes(2);
    dispose();
  });

  it("no longer runs once dispose is called", () => {
    const [value, setValue] = signal(0);
    const callback = jest.fn();
    const dispose = effect(() => {
      value();
      callback();
    });

    dispose();
    setValue(2);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("calls cleanup before it reruns", () => {
    const callback = jest.fn();
    const cleanup = jest.fn();
    const [value, setValue] = signal(0);
    const dispose = effect(() => {
      value();
      callback();
      return () => {
        cleanup();
        expect(callback).toHaveBeenCalledTimes(cleanup.mock.calls.length);
      };
    });

    setValue(1);
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledTimes(2);
    dispose();
  });

  it("cleanup is called on dispose", () => {
    const callback = jest.fn();
    const cleanup = jest.fn();
    const dispose = effect(() => {
      callback();
      return () => {
        cleanup();
      };
    });

    dispose();
    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it("updates are batched", () => {
    const [value, setValue] = signal(0);
    const callback = jest.fn();
    const dispose = effect(() => {
      value();
      callback();
    });

    const dispose2 = effect(() => {
      setValue(1);
      setValue(2);
      setValue(3);
    });

    expect(callback).toHaveBeenCalledTimes(2);
    dispose();
    dispose2();
  });

  it("rerun effect each time dependent signal changes", () => {
    const [value, setValue] = signal(0);
    const callback = jest.fn();
    const dispose = effect(() => {
      value();
      callback();
    });

    setValue(1);
    setValue(2);
    setValue(3);
    expect(callback).toHaveBeenCalledTimes(4);
    dispose();
  });

  it("reruns effect each time dependent computed changes", () => {
    const [value, setValue] = signal(0);
    const computedValue = computed(() => value() + 1);
    const callback = jest.fn();
    const dispose = effect(() => {
      computedValue();
      callback();
    });

    setValue(1);
    setValue(2);
    setValue(3);
    expect(callback).toHaveBeenCalledTimes(4);
    dispose();
  });

  it("cleanup is called in inner effect when outer effect dependency changes", () => {
    const [value, setValue] = signal(0);
    const cleanup = jest.fn();
    const dispose = effect(() => {
      value();
      effect(() => {
        return () => {
          cleanup();
        };
      });
    });

    setValue(1);
    expect(cleanup).toHaveBeenCalledTimes(1);
    dispose();
    expect(cleanup).toHaveBeenCalledTimes(2);
  });
});
