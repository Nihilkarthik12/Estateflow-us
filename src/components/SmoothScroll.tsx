"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // ── 1. Init Lenis smooth scroll ────────────────────────────
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.8,
      infinite: false,
    });

    // Bridge Lenis → GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);
    const ticker = gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // ── 2. Hero photo parallax ─────────────────────────────────
    // The background image moves at 30% scroll speed — creates depth
    gsap.to(".hero-bg-img", {
      yPercent: 18,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });

    // Hero text slides up as page scrolls
    gsap.to(".hero-headline", {
      yPercent: -12,
      opacity: 0.4,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "20% top",
        end: "bottom top",
        scrub: 1.2,
      },
    });

    // ── 3. Stats section — photo parallax ────────────────────────
    gsap.to(".stats-bg-img", {
      yPercent: 15,
      ease: "none",
      scrollTrigger: {
        trigger: ".stats-section",
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5,
      },
    });

    // Stats numbers — dramatic scale-in from below
    gsap.utils.toArray<HTMLElement>(".stat-number-item").forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 80, scale: 0.8 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 1,
          delay: i * 0.12,
          ease: "power4.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // ── 4. Pain section — image reveal ──────────────────────────
    gsap.fromTo(".pain-img",
      { scale: 1.08, filter: "blur(6px)" },
      {
        scale: 1, filter: "blur(0px)",
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".pain-img",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    // Pain cards — slide in from right staggered
    gsap.utils.toArray<HTMLElement>(".pain-card-item").forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, x: 50 },
        {
          opacity: 1, x: 0,
          duration: 0.8,
          delay: i * 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // ── 5. Feature cards — stagger reveal ───────────────────────
    gsap.utils.toArray<HTMLElement>(".feature-card-item").forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 40, filter: "blur(4px)" },
        {
          opacity: 1, y: 0, filter: "blur(0px)",
          duration: 0.9,
          delay: (i % 3) * 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // ── 6. Testimonial cards — blur-lift reveal ──────────────────
    gsap.utils.toArray<HTMLElement>(".testimonial-item").forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 60, filter: "blur(8px)" },
        {
          opacity: 1, y: 0, filter: "blur(0px)",
          duration: 1.1,
          delay: i * 0.18,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // ── 7. Section headlines — word split reveal ─────────────────
    gsap.utils.toArray<HTMLElement>(".cinematic-reveal").forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 48, filter: "blur(10px)" },
        {
          opacity: 1, y: 0, filter: "blur(0px)",
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // ── 8. Contact section — forest panel slides in ───────────────
    gsap.fromTo(".forest-panel-animate",
      { opacity: 0, x: 60 },
      {
        opacity: 1, x: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".forest-panel-animate",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    // ── 9. Contact photo parallax ────────────────────────────────
    gsap.to(".contact-bg-img", {
      yPercent: 12,
      ease: "none",
      scrollTrigger: {
        trigger: ".contact-section",
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5,
      },
    });

    // ── 10. Horizontal rule lines — width expand ─────────────────
    gsap.utils.toArray<HTMLElement>(".rule-expand").forEach((el) => {
      gsap.fromTo(el,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    return () => {
      lenis.destroy();
      gsap.ticker.remove(ticker);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return <>{children}</>;
}
