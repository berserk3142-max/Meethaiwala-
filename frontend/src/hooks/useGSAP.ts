import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Hook for fade-in on scroll animation
export function useScrollFadeIn(options?: { delay?: number; y?: number; duration?: number }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        gsap.fromTo(el,
            {
                opacity: 0,
                y: options?.y ?? 50
            },
            {
                opacity: 1,
                y: 0,
                duration: options?.duration ?? 1,
                delay: options?.delay ?? 0,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [options?.delay, options?.y, options?.duration]);

    return ref;
}

// Hook for stagger children animation
export function useStaggerChildren(stagger = 0.1) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const children = el.children;

        gsap.fromTo(children,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: stagger,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [stagger]);

    return ref;
}

// Hook for scale bounce animation
export function useScaleBounce() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        gsap.fromTo(el,
            { scale: 0.8, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: 0.8,
                ease: 'back.out(1.7)',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return ref;
}

// Hook for parallax effect
export function useParallax(speed = 0.5) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        gsap.to(el, {
            yPercent: -50 * speed,
            ease: 'none',
            scrollTrigger: {
                trigger: el,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [speed]);

    return ref;
}

// Hero title animation
export function animateHeroTitle(titleRef: HTMLElement | null) {
    if (!titleRef) return;

    const chars = titleRef.querySelectorAll('.char');

    gsap.fromTo(chars,
        { opacity: 0, y: 100, rotateX: -90 },
        {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.03,
            ease: 'back.out(1.2)',
        }
    );
}

// Button hover animation
export function buttonHoverAnimation(element: HTMLElement) {
    gsap.to(element, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out',
    });
}

export function buttonLeaveAnimation(element: HTMLElement) {
    gsap.to(element, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
    });
}

// Card hover animation
export function cardHoverAnimation(element: HTMLElement) {
    gsap.to(element, {
        y: -10,
        scale: 1.02,
        boxShadow: '0 20px 40px rgba(233, 30, 140, 0.2)',
        duration: 0.3,
        ease: 'power2.out',
    });
}

export function cardLeaveAnimation(element: HTMLElement) {
    gsap.to(element, {
        y: 0,
        scale: 1,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        duration: 0.3,
        ease: 'power2.out',
    });
}

// Page transition animation
export function pageEnterAnimation(container: HTMLElement) {
    gsap.fromTo(container,
        { opacity: 0, y: 20 },
        {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out'
        }
    );
}

// Floating animation for elements
export function floatingAnimation(element: HTMLElement, amplitude = 20) {
    gsap.to(element, {
        y: `-=${amplitude}`,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
    });
}

// Rotate animation
export function rotateAnimation(element: HTMLElement) {
    gsap.to(element, {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: 'none',
    });
}
