import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function useRevealOnScroll(selector = "[data-reveal]", deps = []) {
  const location = useLocation();

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll(selector));
    if (!nodes.length) return;

    document.body.classList.add("reveal-on");

    const revealNow = () => {
      const viewHeight = window.innerHeight || document.documentElement.clientHeight;

      for (const el of nodes) {
        if (el.classList.contains("is-revealed")) continue;

        const rect = el.getBoundingClientRect();
        if (rect.top < viewHeight * 0.92) {
          el.classList.add("is-revealed");
        }
      }
    };

    // Reveal anything already in view immediately
    revealNow();

    // No IntersectionObserver support: show everything
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-revealed"));
      return;
    }

    const InterObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            InterObserver.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );

    nodes.forEach((node) => InterObserver.observe(node));

    // After state changes, DOM may settle a beat later
    const time1 = setTimeout(revealNow, 50);
    const time2 = setTimeout(revealNow, 250);

    return () => {
      clearTimeout(time1);
      clearTimeout(time2);
      io.disconnect();
    };
  }, [selector, location.pathname, ...deps]);
}

