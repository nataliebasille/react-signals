import { effect, signal, zone } from "..";

describe("zone", () => {
  it("runs all effects within the zone", () => {
    const effect1 = jest.fn();
    const effect2 = jest.fn();

    const dispose = zone(() => {
      effect(effect1);
      effect(effect2);
    });

    expect(effect1).toHaveBeenCalledTimes(1);
    expect(effect2).toHaveBeenCalledTimes(1);

    dispose();
  });

  it("zone top level action doesn't rerun when effect deps changes", () => {
    const [value, setValue] = signal(0);
    const zoneAction = jest.fn().mockImplementation(() => {
      effect(() => {
        value();
      });
    });

    const dispose = zone(zoneAction);
    expect(zoneAction).toHaveBeenCalledTimes(1);
    setValue(1);
    expect(zoneAction).toHaveBeenCalledTimes(1);
    dispose();
  });

  it("effect still reruns within the zone", () => {
    const [value, setValue] = signal(0);
    const effectAction = jest.fn().mockImplementation(() => {
      value();
    });
    const dispose = zone(() => {
      effect(effectAction);
    });
    expect(effectAction).toHaveBeenCalledTimes(1);
    setValue(1);
    expect(effectAction).toHaveBeenCalledTimes(2);
    dispose();
  });
});
