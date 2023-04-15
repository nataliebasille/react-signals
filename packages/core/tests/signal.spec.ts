import { signal } from '..';

describe('createSignal', () => {
  it('signal initializes to value', () => {
    const [value] = signal('my signal');
    expect(value()).toBe('my signal');
  });

  it('signal lazily initializes to value', () => {
    const lazyCheck = jest.fn();
    const [value] = signal(() => {
      lazyCheck();
      return 'my signal';
    });

    expect(lazyCheck).not.toHaveBeenCalled();
    expect(value()).toBe('my signal');
    expect(lazyCheck).toHaveBeenCalledTimes(1);
    value();
    expect(lazyCheck).toHaveBeenCalledTimes(1);
  });

  it('signal value can be updated', () => {
    const [value, setValue] = signal(1);
    expect(value()).toBe(1);
    setValue(1000);
    expect(value()).toBe(1000);
  });
});
