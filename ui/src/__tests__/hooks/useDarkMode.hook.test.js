import {
  renderHook,
  act,
  describe,
  beforeEach,
  it,
  expect,
  jest,
} from '@testing-library/react';
import { useDarkMode } from '../../hooks/useDarkMode';

describe('useDarkMode Hook', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.getItem.mockClear();
    localStorage.setItem.mockClear();
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with true when dark mode is stored in localStorage', () => {
      localStorage.getItem.mockReturnValue('true');

      const { result } = renderHook(() => useDarkMode());

      expect(result.current.isDark).toBe(true);
      expect(localStorage.getItem).toHaveBeenCalledWith('wild-oasis-dark-mode');
    });

    it('should initialize with false when light mode is stored in localStorage', () => {
      localStorage.getItem.mockReturnValue('false');

      const { result } = renderHook(() => useDarkMode());

      expect(result.current.isDark).toBe(false);
    });

    it('should use system preference when no localStorage value exists', () => {
      localStorage.getItem.mockReturnValue(null);
      window.matchMedia.mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const { result } = renderHook(() => useDarkMode());

      expect(result.current.isDark).toBe(true);
    });

    it('should initialize to light mode when system has no dark preference', () => {
      localStorage.getItem.mockReturnValue(null);
      window.matchMedia.mockImplementation(() => ({
        matches: false,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const { result } = renderHook(() => useDarkMode());

      expect(result.current.isDark).toBe(false);
    });
  });

  describe('useEffect - Document attribute and localStorage sync', () => {
    it('should set document theme to dark and persist to localStorage when isDark is true', () => {
      localStorage.getItem.mockReturnValue('false');
      const getAttributeSpy = jest.spyOn(
        document.documentElement,
        'setAttribute',
      );

      const { result } = renderHook(() => useDarkMode());

      act(() => {
        result.current.toggleDark();
      });

      expect(getAttributeSpy).toHaveBeenCalledWith('data-theme', 'dark');
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'wild-oasis-dark-mode',
        'true',
      );

      getAttributeSpy.mockRestore();
    });

    it('should set document theme to light and persist to localStorage when isDark is false', () => {
      localStorage.getItem.mockReturnValue('true');
      const getAttributeSpy = jest.spyOn(
        document.documentElement,
        'setAttribute',
      );

      const { result } = renderHook(() => useDarkMode());

      act(() => {
        result.current.toggleDark();
      });

      expect(getAttributeSpy).toHaveBeenCalledWith('data-theme', 'light');
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'wild-oasis-dark-mode',
        'false',
      );

      getAttributeSpy.mockRestore();
    });

    it('should update document attribute on mount', () => {
      localStorage.getItem.mockReturnValue('true');
      const getAttributeSpy = jest.spyOn(
        document.documentElement,
        'setAttribute',
      );

      renderHook(() => useDarkMode());

      expect(getAttributeSpy).toHaveBeenCalledWith('data-theme', 'dark');

      getAttributeSpy.mockRestore();
    });
  });

  describe('toggleDark function', () => {
    it('should toggle from dark to light', () => {
      localStorage.getItem.mockReturnValue('true');

      const { result } = renderHook(() => useDarkMode());
      expect(result.current.isDark).toBe(true);

      act(() => {
        result.current.toggleDark();
      });

      expect(result.current.isDark).toBe(false);
    });

    it('should toggle from light to dark', () => {
      localStorage.getItem.mockReturnValue('false');

      const { result } = renderHook(() => useDarkMode());
      expect(result.current.isDark).toBe(false);

      act(() => {
        result.current.toggleDark();
      });

      expect(result.current.isDark).toBe(true);
    });

    it('should toggle multiple times', () => {
      localStorage.getItem.mockReturnValue('false');

      const { result } = renderHook(() => useDarkMode());

      act(() => {
        result.current.toggleDark();
      });
      expect(result.current.isDark).toBe(true);

      act(() => {
        result.current.toggleDark();
      });
      expect(result.current.isDark).toBe(false);

      act(() => {
        result.current.toggleDark();
      });
      expect(result.current.isDark).toBe(true);
    });
  });

  describe('Return value structure', () => {
    it('should return object with isDark and toggleDark properties', () => {
      localStorage.getItem.mockReturnValue('false');

      const { result } = renderHook(() => useDarkMode());

      expect(result.current).toHaveProperty('isDark');
      expect(result.current).toHaveProperty('toggleDark');
      expect(typeof result.current.toggleDark).toBe('function');
      expect(typeof result.current.isDark).toBe('boolean');
    });
  });
});
