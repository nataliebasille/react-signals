import { batch, computed, signal } from '..';

describe('batch', () => {
  it('computed signals update only after batch is finished', () => {
    const [one, setOne] = signal('value 1');
    const two = computed(() => one());

    batch(() => {
      expect(one()).toBe('value 1');
      expect(two()).toBe('value 1');

      setOne('changed value');
      expect(one()).toBe('changed value');
      expect(two()).toBe('value 1');
    });

    expect(two()).toBe('changed value');
  });
});
