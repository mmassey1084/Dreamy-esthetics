// router.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Layout from "../components/Layout";
import Home from "../pages/Home";
import Policy from "../pages/Policy";
import Booking from "../pages/Booking";
import GiftCard from "../pages/GiftCard";
import About from "../pages/About";
import BookPlus from "../pages/BookPlus";

export default function Router() {
  const location = useLocation();

  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");

    els.forEach((el) => el.classList.remove("is-revealed"));

    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      els.forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    els.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, [location.pathname]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/gift-card" element={<GiftCard />} />
        <Route path="/about" element={<About />} />
        <Route path="/book-plus" element={<BookPlus />} />
      </Route>
    </Routes>
  );
}

