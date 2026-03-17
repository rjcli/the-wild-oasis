import {
  renderHook,
  act,
  jest,
  describe,
  it,
  expect,
  beforeEach,
} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useMoveBack } from '../../hooks/useMoveBack';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

import { useNavigate } from 'react-router-dom';

const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('useMoveBack Hook', () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });

  describe('Basic functionality', () => {
    it('should return a function', () => {
      const { result } = renderHook(() => useMoveBack(), { wrapper });

      expect(typeof result.current).toBe('function');
    });

    it('should call navigate with -1 when returned function is called', () => {
      const { result } = renderHook(() => useMoveBack(), { wrapper });

      act(() => {
        result.current();
      });

      expect(mockNavigate).toHaveBeenCalledWith(-1);
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

    it('should call navigate with exactly -1, not other values', () => {
      const { result } = renderHook(() => useMoveBack(), { wrapper });

      act(() => {
        result.current();
      });

      expect(mockNavigate).toHaveBeenCalledWith(-1);
      expect(mockNavigate).not.toHaveBeenCalledWith(-2);
      expect(mockNavigate).not.toHaveBeenCalledWith(1);
      expect(mockNavigate).not.toHaveBeenCalledWith('/');
    });
  });

  describe('Multiple invocations', () => {
    it('should navigate back multiple times', () => {
      const { result } = renderHook(() => useMoveBack(), { wrapper });

      act(() => {
        result.current();
      });

      act(() => {
        result.current();
      });

      expect(mockNavigate).toHaveBeenCalledTimes(2);
      expect(mockNavigate).toHaveBeenNthCalledWith(1, -1);
      expect(mockNavigate).toHaveBeenNthCalledWith(2, -1);
    });
  });

  describe('Integration with useNavigate', () => {
    it('should use the navigate function from useNavigate hook', () => {
      renderHook(() => useMoveBack(), { wrapper });

      expect(useNavigate).toHaveBeenCalled();
    });

    it('should work with different navigate mock implementations', () => {
      const customNavigate = jest.fn();
      useNavigate.mockReturnValue(customNavigate);

      const { result } = renderHook(() => useMoveBack(), { wrapper });

      act(() => {
        result.current();
      });

      expect(customNavigate).toHaveBeenCalledWith(-1);
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Hook consistency', () => {
    it('should return the same function reference on re-renders', () => {
      const { result, rerender } = renderHook(() => useMoveBack(), { wrapper });

      const firstFunction = result.current;

      rerender();

      const secondFunction = result.current;
      expect(firstFunction).toBe(secondFunction);
    });
  });
});
