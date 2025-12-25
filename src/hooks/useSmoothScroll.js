import { useEffect } from 'react';
import Lenis from 'lenis';

export default function useSmoothScroll() {
  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    // Animation frame loop
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Track current section
    let currentSectionIndex = 0;
    let isScrolling = false;
    const sections = document.querySelectorAll('.snap-section');

    // Helper function to check if element is scrollable
    const isScrollableElement = (element) => {
      if (!element) return false;
      
      const style = window.getComputedStyle(element);
      const overflowY = style.overflowY;
      const hasScrollableContent = element.scrollHeight > element.clientHeight;
      
      return (overflowY === 'scroll' || overflowY === 'auto') && hasScrollableContent;
    };

    // Helper function to check if we're at scroll boundary
    const isAtScrollBoundary = (element, direction) => {
      if (!element) return true;
      
      const { scrollTop, scrollHeight, clientHeight } = element;
      
      if (direction > 0) {
        // Scrolling down - check if at bottom
        return scrollTop + clientHeight >= scrollHeight - 1;
      } else {
        // Scrolling up - check if at top
        return scrollTop <= 1;
      }
    };

    // Find the nearest scrollable parent
    const findScrollableParent = (element) => {
      let current = element;
      
      while (current && current !== document.body) {
        if (isScrollableElement(current)) {
          return current;
        }
        current = current.parentElement;
      }
      
      return null;
    };

    // Detect scroll direction and snap to next/prev section
    const handleWheel = (e) => {
      // Check if the wheel event originated from within a scrollable container
      const scrollableParent = findScrollableParent(e.target);
      
      if (scrollableParent) {
        // We're inside a scrollable element
        const direction = e.deltaY > 0 ? 1 : -1;
        const atBoundary = isAtScrollBoundary(scrollableParent, direction);
        
        if (!atBoundary) {
          // Not at boundary, allow normal scrolling within the container
          return;
        }
        // If at boundary, continue to section snapping below
      }

      if (isScrolling) {
        e.preventDefault();
        return;
      }

      const direction = e.deltaY > 0 ? 1 : -1; // 1 = down, -1 = up
      const nextIndex = currentSectionIndex + direction;

      // Check if next section exists
      if (nextIndex >= 0 && nextIndex < sections.length) {
        e.preventDefault();
        isScrolling = true;
        currentSectionIndex = nextIndex;

        lenis.scrollTo(sections[currentSectionIndex], {
          offset: 0,
          duration: 1,
          onComplete: () => {
            setTimeout(() => {
              isScrolling = false;
            }, 500); // Prevent rapid scrolling
          },
        });
      } else {
        // Allow small scroll at boundaries
        setTimeout(() => {
          isScrolling = false;
        }, 300);
      }
    };

    // Keyboard navigation
    const handleKeyDown = (e) => {
      if (isScrolling) return;

      // Check if we're inside a scrollable modal or container
      const activeElement = document.activeElement;
      const scrollableParent = findScrollableParent(activeElement);
      
      if (scrollableParent && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        // Let the scrollable container handle it
        return;
      }

      let targetIndex = currentSectionIndex;

      if (e.key === 'ArrowDown' && currentSectionIndex < sections.length - 1) {
        targetIndex = currentSectionIndex + 1;
      } else if (e.key === 'ArrowUp' && currentSectionIndex > 0) {
        targetIndex = currentSectionIndex - 1;
      }

      if (targetIndex !== currentSectionIndex) {
        e.preventDefault();
        isScrolling = true;
        currentSectionIndex = targetIndex;

        lenis.scrollTo(sections[currentSectionIndex], {
          duration: 1,
          onComplete: () => {
            setTimeout(() => {
              isScrolling = false;
            }, 500);
          },
        });
      }
    };

    // Update current section based on scroll position
    const updateCurrentSection = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          currentSectionIndex = index;
        }
      });
    };

    // Initial section detection
    updateCurrentSection();

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      lenis.destroy();
    };
  }, []);
}