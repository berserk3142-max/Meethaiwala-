import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Lenis smooth scroll instance
let lenisInstance: Lenis | null = null;

export function useLenis() {
    useEffect(() => {
        // Initialize Lenis
        lenisInstance = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });

        // Connect Lenis to GSAP ScrollTrigger
        lenisInstance.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenisInstance?.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        return () => {
            lenisInstance?.destroy();
            lenisInstance = null;
        };
    }, []);

    return lenisInstance;
}

// Get Lenis instance for external use
export function getLenis() {
    return lenisInstance;
}

// Scroll to element smoothly
export function scrollTo(target: string | HTMLElement, options?: { offset?: number; duration?: number }) {
    lenisInstance?.scrollTo(target, {
        offset: options?.offset ?? 0,
        duration: options?.duration ?? 1.5,
    });
}
