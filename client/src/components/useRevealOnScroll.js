import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function useRevealOnScroll(selector = "[data-reveal]", deps = []) {
  const location = useLocation();

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll(selector));
    if (!nodes.length) return;

    document.body.classList.add("reveal-on");

    const revealNow = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;

      for (const el of nodes) {
        // If your CSS hides [data-reveal] until .is-revealed,
        // this ensures newly-rendered nodes can become visible.
        if (el.classList.contains("is-revealed")) continue;

        const rect = el.getBoundingClientRect();
        if (rect.top < vh * 0.92) {
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

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );

    nodes.forEach((node) => io.observe(node));

    // After state changes, DOM may settle a beat later
    const t1 = setTimeout(revealNow, 50);
    const t2 = setTimeout(revealNow, 250);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      io.disconnect();
    };
  }, [selector, location.pathname, ...deps]);
}

