import { computed, effect, signal, untrack } from "..";

describe("untrack", () => {
  it("untracked signals do not trigger effects", () => {
    const [one, setOne] = signal("value 1");
    const callback = jest.fn();
    const dispose = effect(() => {
      untrack(() => one());
      callback();
    });
    expect(callback).toHaveBeenCalledTimes(1);
    setOne("changed value");
    expect(callback).toHaveBeenCalledTimes(1);
    dispose();
  });

  it("untracked signals do not trigger computed", () => {
    const [one, setOne] = signal("value 1");
    const two = computed(() => untrack(one));
    expect(two()).toEqual("value 1");
    setOne("changed value");
    expect(two()).toEqual("value 1");
  });

  it("effect with untracted signal can still update", () => {
    const [one, setOne] = signal("value 1");
    const callback1 = jest.fn();
    const dispose1 = effect(() => {
      untrack(() => one());
      callback1();
    });
    const callback2 = jest.fn();
    const dispose2 = effect(() => {
      one();
      callback2();
    });

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);

    setOne("changed value");
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(2);

    dispose1();
    dispose2();
  });

  it("effect with a trackable signal can still be updated", () => {
    const [one, setOne] = signal("value 1");
    const [two, setTwo] = signal("value 2");
    const callback1 = jest.fn();
    const dispose1 = effect(() => {
      untrack(() => one());
      two();
      callback1();
    });

    expect(callback1).toHaveBeenCalledTimes(1);
    setOne("changed value 1");
    expect(callback1).toHaveBeenCalledTimes(1);
    setTwo("changed value 2");
    expect(callback1).toHaveBeenCalledTimes(2);
    dispose1();
  });
});
