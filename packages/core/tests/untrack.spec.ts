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
});
