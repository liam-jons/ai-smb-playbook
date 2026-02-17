import { useRef, useState, useEffect, useCallback, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ScrollHintProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wraps horizontally-scrollable content (tables, code blocks) and shows
 * a subtle gradient fade on the right edge when more content is available
 * off-screen. The hint disappears once the user scrolls to the end.
 *
 * On iOS and mobile browsers, native scrollbars are hidden — this gradient
 * is the only visual cue that horizontal scrolling is possible.
 */
export function ScrollHint({ children, className }: ScrollHintProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    // Allow 1px tolerance for sub-pixel rounding
    setCanScrollRight(scrollWidth - clientWidth - scrollLeft > 1);
    setCanScrollLeft(scrollLeft > 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Initial check
    checkScroll();

    // Re-check on scroll
    el.addEventListener('scroll', checkScroll, { passive: true });

    // Re-check on resize (content or viewport change)
    const resizeObserver = new ResizeObserver(checkScroll);
    resizeObserver.observe(el);

    // Also observe the first child in case its width changes (e.g. lazy-loaded content)
    if (el.firstElementChild) {
      resizeObserver.observe(el.firstElementChild);
    }

    return () => {
      el.removeEventListener('scroll', checkScroll);
      resizeObserver.disconnect();
    };
  }, [checkScroll]);

  return (
    <div className={cn('scroll-hint-wrapper', className)}>
      <div
        ref={scrollRef}
        className="overflow-x-auto"
      >
        {children}
      </div>

      {/* Right fade gradient — visible when more content is to the right */}
      <div
        className={cn(
          'scroll-hint-fade scroll-hint-fade-right',
          canScrollRight ? 'opacity-100' : 'opacity-0',
        )}
        aria-hidden="true"
      />

      {/* Left fade gradient — visible when user has scrolled right */}
      <div
        className={cn(
          'scroll-hint-fade scroll-hint-fade-left',
          canScrollLeft ? 'opacity-100' : 'opacity-0',
        )}
        aria-hidden="true"
      />
    </div>
  );
}
