'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    let mouseX = 0;
    let mouseY = 0;
    let customCursorX = 0;
    let customCursorY = 0;

    // Use a flag to pause follow animation when magnetic
    let isMagnetic = false;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isMagnetic) {
        gsap.to(cursor, {
          x: mouseX,
          y: mouseY,
          duration: 0.1,
          ease: 'power2.out',
        });
      }
    };

    const render = () => {
      if (!isMagnetic) {
        customCursorX += (mouseX - customCursorX) * 0.2;
        customCursorY += (mouseY - customCursorY) * 0.2;

        gsap.set(follower, {
          x: customCursorX,
          y: customCursorY,
        });
      }

      requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove);
    requestAnimationFrame(render);

    // Make elements magnetic
    const magneticElements = document.querySelectorAll('.magnetic-wrap');

    magneticElements.forEach(() => {
      const magnet = el as HTMLElement;

      const onMagnetMove = (e: MouseEvent) => {
        isMagnetic = true;
        const rect = magnet.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;

        // Move element slightly
        gsap.to(magnet, {
          x: distanceX * 0.2,
          y: distanceY * 0.2,
          duration: 0.4,
          ease: 'power2.out'
        });

        // Snap cursor perfectly to center
        gsap.to(cursor, {
          x: centerX,
          y: centerY,
          scale: 0,
          opacity: 0,
          duration: 0.2
        });

        // Expand follower to wrap button
        gsap.to(follower, {
          x: centerX,
          y: centerY,
          width: rect.width + 20,
          height: rect.height + 20,
          borderRadius: "8px",
          backgroundColor: "rgba(220, 38, 38, 0.1)", // Red tinted background
          border: "1px solid rgba(220, 38, 38, 0.8)",
          duration: 0.3,
          ease: "back.out(1.5)"
        });
      };

      const onMagnetLeave = () => {
        isMagnetic = false;

        gsap.to(magnet, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: 'elastic.out(1, 0.3)'
        });

        gsap.to(cursor, {
          scale: 1,
          opacity: 1,
          duration: 0.2
        });

        gsap.to(follower, {
          width: 40,
          height: 40,
          borderRadius: "50%",
          backgroundColor: "transparent",
          border: "1px solid rgba(220, 38, 38, 0.5)",
          duration: 0.3,
          ease: "power2.out"
        });

        // Reset follower coordinates to current mouse pos
        customCursorX = mouseX;
        customCursorY = mouseY;
      };

      magnet.addEventListener('mousemove', onMagnetMove);
      magnet.addEventListener('mouseleave', onMagnetLeave);
    });

    // Standard interactive elements that aren't magnetic
    const interactiveElements = document.querySelectorAll('a:not(.magnetic-wrap), button:not(.magnetic-wrap), input, textarea, select, [role="button"]:not(.magnetic-wrap)');

    const onMouseEnter = () => {
      gsap.to(cursor, { scale: 1.5, opacity: 0.5, duration: 0.3 });
      gsap.to(follower, { scale: 0.5, opacity: 0, duration: 0.3 });
    };

    const onMouseLeave = () => {
      gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3 });
      gsap.to(follower, { scale: 1, opacity: 1, duration: 0.3 });
    };

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mouseleave', onMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
      });
      magneticElements.forEach(() => {
        // Remove event listeners logic here if needed for cleanup
        // Note: simplifying cleanup for standard elements in this snippet
      });
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-3 h-3 bg-red-600 rounded-full pointer-events-none z-[9999] mix-blend-difference -translate-x-1/2 -translate-y-1/2"
      />
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-10 h-10 border border-red-600/50 rounded-full pointer-events-none z-[9998] mix-blend-screen -translate-x-1/2 -translate-y-1/2"
      />
    </>
  );
}
