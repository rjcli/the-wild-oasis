import {
  renderHook,
  act,
  describe,
  beforeEach,
  jest,
  it,
  expect,
} from '@testing-library/react';
import { useLocalStorageState } from '../../hooks/useLocalStorageState';

describe('useLocalStorageState Hook', () => {
  const testKey = 'test-key';
  const initialValue = { count: 0 };

  beforeEach(() => {
    localStorage.clear();
    localStorage.getItem.mockClear();
    localStorage.setItem.mockClear();
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with initialState when localStorage is empty', () => {
      localStorage.getItem.mockReturnValue(null);

      const { result } = renderHook(() =>
        useLocalStorageState(initialValue, testKey),
      );
      const [value] = result.current;

      expect(value).toEqual(initialValue);
    });

    it('should initialize with stored value from localStorage', () => {
      const storedValue = { count: 5 };
      localStorage.getItem.mockReturnValue(JSON.stringify(storedValue));

      const { result } = renderHook(() =>
        useLocalStorageState(initialValue, testKey),
      );
      const [value] = result.current;

      expect(value).toEqual(storedValue);
    });

    it('should parse JSON from localStorage correctly', () => {
      const storedValue = { nested: { value: 'test' }, array: [1, 2, 3] };
      localStorage.getItem.mockReturnValue(JSON.stringify(storedValue));

      const { result } = renderHook(() =>
        useLocalStorageState(initialValue, testKey),
      );
      const [value] = result.current;

      expect(value).toEqual(storedValue);
      expect(value.nested.value).toBe('test');
      expect(value.array).toEqual([1, 2, 3]);
    });

    it('should call localStorage.getItem with correct key', () => {
      localStorage.getItem.mockReturnValue(null);

      renderHook(() => useLocalStorageState(initialValue, testKey));

      expect(localStorage.getItem).toHaveBeenCalledWith(testKey);
    });

    it('should handle string initial state', () => {
      localStorage.getItem.mockReturnValue(null);

      const { result } = renderHook(() =>
        useLocalStorageState('initial string', testKey),
      );
      const [value] = result.current;

      expect(value).toBe('initial string');
    });

    it('should handle number initial state', () => {
      localStorage.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useLocalStorageState(42, testKey));
      const [value] = result.current;

      expect(value).toBe(42);
    });

    it('should handle array initial state', () => {
      localStorage.getItem.mockReturnValue(null);
      const initialArray = [1, 2, 3];

      const { result } = renderHook(() =>
        useLocalStorageState(initialArray, testKey),
      );
      const [value] = result.current;

      expect(value).toEqual(initialArray);
    });
  });

  describe('State updates and localStorage sync', () => {
    it('should update state when setter is called', () => {
      localStorage.getItem.mockReturnValue(null);

      const { result } = renderHook(() =>
        useLocalStorageState(initialValue, testKey),
      );
      const [, setValue] = result.current;

      const newValue = { count: 10 };
      act(() => {
        setValue(newValue);
      });

      const [updatedValue] = result.current;
      expect(updatedValue).toEqual(newValue);
    });

    it('should persist state to localStorage when state changes', () => {
      localStorage.getItem.mockReturnValue(null);

      const { result } = renderHook(() =>
        useLocalStorageState(initialValue, testKey),
      );
      const [, setValue] = result.current;

      const newValue = { count: 25 };
      act(() => {
        setValue(newValue);
      });

      expect(localStorage.setItem).toHaveBeenCalledWith(
        testKey,
        JSON.stringify(newValue),
      );
    });

    it('should serialize complex objects correctly', () => {
      localStorage.getItem.mockReturnValue(null);

      const { result } = renderHook(() =>
        useLocalStorageState(initialValue, testKey),
      );
      const [, setValue] = result.current;

      const complexValue = {
        user: { name: 'John', age: 30 },
        items: [1, 2, 3],
        timestamp: 1234567890,
      };

      act(() => {
        setValue(complexValue);
      });

      const serialized = JSON.stringify(complexValue);
      expect(localStorage.setItem).toHaveBeenCalledWith(testKey, serialized);
    });

    it('should support functional setState', () => {
      localStorage.getItem.mockReturnValue(null);

      const { result } = renderHook(() =>
        useLocalStorageState(initialValue, testKey),
      );
      const [, setValue] = result.current;

      act(() => {
        setValue((prev) => ({ count: prev.count + 1 }));
      });

      const [updatedValue] = result.current;
      expect(updatedValue).toEqual({ count: 1 });
    });

    it('should handle multiple sequential updates', () => {
      localStorage.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useLocalStorageState(0, testKey));
      const [, setValue] = result.current;

      act(() => {
        setValue(1);
      });

      let [value] = result.current;
      expect(value).toBe(1);

      act(() => {
        setValue(2);
      });

      [value] = result.current;
      expect(value).toBe(2);
    });
  });

  describe('Different data types', () => {
    it('should handle boolean values', () => {
      localStorage.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useLocalStorageState(false, testKey));
      const [, setValue] = result.current;

      act(() => {
        setValue(true);
      });

      const [value] = result.current;
      expect(value).toBe(true);
    });

    it('should handle nested arrays', () => {
      localStorage.getItem.mockReturnValue(null);

      const initial = [
        [1, 2],
        [3, 4],
      ];
      const { result } = renderHook(() =>
        useLocalStorageState(initial, testKey),
      );
      const [, setValue] = result.current;

      const newValue = [
        [5, 6],
        [7, 8],
      ];
      act(() => {
        setValue(newValue);
      });

      const [value] = result.current;
      expect(value).toEqual(newValue);
    });

    it('should handle null values', () => {
      localStorage.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useLocalStorageState(null, testKey));
      const [, setValue] = result.current;

      act(() => {
        setValue({ data: 'test' });
      });

      const [value] = result.current;
      expect(value).toEqual({ data: 'test' });
    });
  });

  describe('Hook return value structure', () => {
    it('should return array with value and setValue', () => {
      localStorage.getItem.mockReturnValue(null);

      const { result } = renderHook(() =>
        useLocalStorageState(initialValue, testKey),
      );

      expect(Array.isArray(result.current)).toBe(true);
      expect(result.current.length).toBe(2);
      expect(typeof result.current[1]).toBe('function');
    });
  });
});
