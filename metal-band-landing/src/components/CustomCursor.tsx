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

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: 'power2.out',
      });
    };

    const render = () => {
      customCursorX += (mouseX - customCursorX) * 0.2;
      customCursorY += (mouseY - customCursorY) * 0.2;

      gsap.set(follower, {
        x: customCursorX,
        y: customCursorY,
      });

      requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove);
    requestAnimationFrame(render);

    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, [role="button"]');

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
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-4 h-4 bg-red-600 rounded-full pointer-events-none z-[9999] mix-blend-difference -translate-x-1/2 -translate-y-1/2"
      />
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-10 h-10 border border-red-600/50 rounded-full pointer-events-none z-[9998] mix-blend-difference -translate-x-1/2 -translate-y-1/2 transition-transform"
      />
    </>
  );
}
