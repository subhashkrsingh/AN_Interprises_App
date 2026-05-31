import { useCallback, useEffect, useRef } from 'react';

const EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];

function useSessionTimeout(onTimeout, onActivity, timeoutMs = 14 * 60 * 1000) {
  const timerRef = useRef(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(onTimeout, timeoutMs);
    onActivity?.();
  }, [onTimeout, onActivity, timeoutMs]);

  useEffect(() => {
    EVENTS.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();
    return () => {
      EVENTS.forEach((event) => window.removeEventListener(event, resetTimer));
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [resetTimer]);
}

export default useSessionTimeout;
