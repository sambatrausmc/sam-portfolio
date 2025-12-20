import { useEffect } from 'react';

let scrollPosition = 0;

export function useScrollLock(isLocked) {
  useEffect(() => {
    if (isLocked) {
      // Save current position
      scrollPosition = window.pageYOffset;
      
      // Lock scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
    } else {
      // Unlock scroll
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      
      // Restore position
      window.scrollTo(0, scrollPosition);
    }
  }, [isLocked]);
}