import { computed, effect, signal } from "..";

describe("computed", () => {
  it("computed is updated when dependent signal is updated", () => {
    const [value, setValue] = signal(1);
    const doubled = computed(() => value() * 2);
    expect(doubled()).toBe(2);
    setValue(doubled());
    expect(doubled()).toBe(4);
  });

  it("computed is updated when a dependent computed changes", () => {
    const [value, setValue] = signal(1);
    const doubled = computed(() => value() * 2);
    const plus3 = computed(() => doubled() + 3);
    expect(plus3()).toBe(5);
    setValue(plus3());
    expect(plus3()).toBe(13);
  });

  it("computed in effect is only calculated once until signal changes", () => {
    const [value, setValue] = signal(1);
    const callback = jest.fn();
    const computedValue = computed(() => {
      callback();
      return value() * 2;
    });

    effect(() => {
      computedValue();
      computedValue();
    });

    expect(callback).toHaveBeenCalledTimes(1);

    setValue(2);
    expect(callback).toHaveBeenCalledTimes(2);
  });
});
