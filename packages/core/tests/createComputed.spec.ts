import { computed, signal } from '..';

describe('createComputed', () => {
  it('computed is updated when dependent signal is updated', () => {
    const [value, setValue] = signal(1);
    const doubled = computed(() => value() * 2);
    expect(doubled()).toBe(2);
    setValue(doubled());
    expect(doubled()).toBe(4);
  });

  it('computed is updated when a dependent computed changes', () => {
    const [value, setValue] = signal(1);
    const doubled = computed(() => value() * 2);
    const plus3 = computed(() => doubled() + 3);
    expect(plus3()).toBe(5);
    setValue(plus3());
    expect(plus3()).toBe(13);
  });
});
