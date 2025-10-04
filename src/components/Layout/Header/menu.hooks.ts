// --------------------------------------
// 📁 File: src/components/Layout/Header/menu.hooks.ts  (NEW)
// --------------------------------------
import { useEffect, useRef, useState } from 'react';

/**
 * Detect scroll direction and distance. Returns: { direction: 'up' | 'down', y: number }
 */
export function useScrollDirection(threshold = 6) {
  const [y, setY] = useState(0);
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const curr = window.scrollY;
      const delta = Math.abs(curr - lastY.current);
      if (delta < threshold) return;
      setDirection(curr > lastY.current ? 'down' : 'up');
      lastY.current = curr;
      setY(curr);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return { direction, y } as const;
}