import {
  renderHook,
  act,
  describe,
  beforeEach,
  jest,
  it,
  expect,
} from '@testing-library/react';
import { useOutsideClick } from '../../hooks/useOutsideClick';

describe('useOutsideClick Hook', () => {
  let handler;

  beforeEach(() => {
    handler = jest.fn();
    jest.clearAllMocks();
  });

  describe('Ref creation', () => {
    it('should return a ref object', () => {
      const { result } = renderHook(() => useOutsideClick(handler));

      expect(result.current).toHaveProperty('current');
    });

    it('should return a mutable ref', () => {
      const { result } = renderHook(() => useOutsideClick(handler));

      const testElement = document.createElement('div');
      act(() => {
        result.current.current = testElement;
      });

      expect(result.current.current).toBe(testElement);
    });
  });

  describe('Outside click detection', () => {
    it('should call handler when clicking outside the ref element', () => {
      const { result } = renderHook(() => useOutsideClick(handler));

      const refElement = document.createElement('div');
      const outsideElement = document.createElement('button');
      document.body.appendChild(refElement);
      document.body.appendChild(outsideElement);

      act(() => {
        result.current.current = refElement;
      });

      act(() => {
        outsideElement.click();
      });

      expect(handler).toHaveBeenCalled();

      document.body.removeChild(refElement);
      document.body.removeChild(outsideElement);
    });

    it('should not call handler when clicking inside the ref element', () => {
      const { result } = renderHook(() => useOutsideClick(handler));

      const refElement = document.createElement('div');
      const button = document.createElement('button');
      refElement.appendChild(button);
      document.body.appendChild(refElement);

      act(() => {
        result.current.current = refElement;
      });

      act(() => {
        button.click();
      });

      expect(handler).not.toHaveBeenCalled();

      document.body.removeChild(refElement);
    });

    it('should call handler once when clicking outside after setup', () => {
      const { result } = renderHook(() => useOutsideClick(handler));

      const refElement = document.createElement('div');
      const clickElement = document.createElement('button');
      document.body.appendChild(refElement);
      document.body.appendChild(clickElement);

      act(() => {
        result.current.current = refElement;
      });

      act(() => {
        clickElement.click();
      });

      expect(handler).toHaveBeenCalledTimes(1);

      document.body.removeChild(refElement);
      document.body.removeChild(clickElement);
    });
  });

  describe('Event listener registration', () => {
    it('should add click event listener to document on mount', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

      renderHook(() => useOutsideClick(handler));

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'click',
        expect.any(Function),
        true,
      );

      addEventListenerSpy.mockRestore();
    });

    it('should use capturing phase by default', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

      renderHook(() => useOutsideClick(handler));

      const calls = addEventListenerSpy.mock.calls.filter(
        (call) => call[0] === 'click',
      );
      expect(calls[calls.length - 1][2]).toBe(true);

      addEventListenerSpy.mockRestore();
    });

    it('should use bubbling phase when listenCapturing=false', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

      renderHook(() => useOutsideClick(handler, false));

      const calls = addEventListenerSpy.mock.calls.filter(
        (call) => call[0] === 'click',
      );
      expect(calls[calls.length - 1][2]).toBe(false);

      addEventListenerSpy.mockRestore();
    });
  });

  describe('Event listener cleanup', () => {
    it('should remove click event listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(
        document,
        'removeEventListener',
      );

      const { unmount } = renderHook(() => useOutsideClick(handler));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'click',
        expect.any(Function),
        true,
      );

      removeEventListenerSpy.mockRestore();
    });

    it('should prevent memory leaks by cleaning up listeners', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
      const removeEventListenerSpy = jest.spyOn(
        document,
        'removeEventListener',
      );

      const { unmount } = renderHook(() => useOutsideClick(handler));

      expect(addEventListenerSpy).toHaveBeenCalled();

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalled();

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });
  });

  describe('Complex scenarios', () => {
    it('should handle multiple clicks on different elements', () => {
      const { result } = renderHook(() => useOutsideClick(handler));

      const refElement = document.createElement('div');
      const outside1 = document.createElement('button');
      const outside2 = document.createElement('button');
      const inside = document.createElement('span');

      refElement.appendChild(inside);
      document.body.appendChild(refElement);
      document.body.appendChild(outside1);
      document.body.appendChild(outside2);

      act(() => {
        result.current.current = refElement;
      });

      act(() => {
        outside1.click();
      });

      expect(handler).toHaveBeenCalledTimes(1);

      act(() => {
        inside.click();
      });

      expect(handler).toHaveBeenCalledTimes(1);

      act(() => {
        outside2.click();
      });

      expect(handler).toHaveBeenCalledTimes(2);

      document.body.removeChild(refElement);
      document.body.removeChild(outside1);
      document.body.removeChild(outside2);
    });

    it('should work with nested elements inside ref', () => {
      const { result } = renderHook(() => useOutsideClick(handler));

      const refElement = document.createElement('div');
      const child = document.createElement('div');
      const grandchild = document.createElement('button');

      child.appendChild(grandchild);
      refElement.appendChild(child);
      document.body.appendChild(refElement);

      act(() => {
        result.current.current = refElement;
      });

      act(() => {
        grandchild.click();
      });

      expect(handler).not.toHaveBeenCalled();

      document.body.removeChild(refElement);
    });
  });

  describe('Handler updates', () => {
    it('should use updated handler function', () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();

      const { result, rerender } = renderHook(({ fn }) => useOutsideClick(fn), {
        initialProps: { fn: handler1 },
      });

      const refElement = document.createElement('div');
      const clickElement = document.createElement('button');
      document.body.appendChild(refElement);
      document.body.appendChild(clickElement);

      act(() => {
        result.current.current = refElement;
      });

      act(() => {
        clickElement.click();
      });

      expect(handler1).toHaveBeenCalledTimes(1);

      rerender({ fn: handler2 });

      act(() => {
        clickElement.click();
      });

      expect(handler2).toHaveBeenCalledTimes(1);

      document.body.removeChild(refElement);
      document.body.removeChild(clickElement);
    });
  });
});
