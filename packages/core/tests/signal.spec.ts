import { computed, effect, signal } from "..";

describe("createSignal", () => {
  it("signal initializes to value", () => {
    const [value] = signal("my signal");
    expect(value()).toBe("my signal");
  });

  it("signal lazily initializes to value", () => {
    const lazyCheck = jest.fn();
    const [value] = signal(() => {
      lazyCheck();
      return "my signal";
    });

    expect(lazyCheck).not.toHaveBeenCalled();
    expect(value()).toBe("my signal");
    expect(lazyCheck).toHaveBeenCalledTimes(1);
    value();
    expect(lazyCheck).toHaveBeenCalledTimes(1);
  });

  it("signal value can be updated", () => {
    const [value, setValue] = signal(1);
    expect(value()).toBe(1);
    setValue(1000);
    expect(value()).toBe(1000);
  });

  it("signal can be used as dependency to multiple effects", () => {
    const [value, setValue] = signal(1);
    const callback = jest.fn();
    const dispose1 = effect(() => {
      value();
      callback();
    });
    const dispose2 = effect(() => {
      value();
      callback();
    });

    setValue(2);
    expect(callback).toHaveBeenCalledTimes(4);
    dispose1();
    dispose2();
  });

  it("signal can be used as dependency to multiple computed values", () => {
    const [value, setValue] = signal(1);
    const callback = jest.fn();
    const computedValue = computed(() => {
      callback();
      return value() * 2;
    });
    const computedValue2 = computed(() => {
      callback();
      return value() * 3;
    });
    expect(computedValue()).toBe(2);
    expect(computedValue2()).toBe(3);
    setValue(2);
    expect(computedValue()).toBe(4);
    expect(computedValue2()).toBe(6);
    expect(callback).toHaveBeenCalledTimes(4);
  });
});
