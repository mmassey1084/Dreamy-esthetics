import { useCallback, useEffect, useMemo, useState } from "react";
import useRevealOnScroll from "./useRevealOnScroll";

function clampIndex(i, len) {
  if (len <= 0) return 0;
  return (i % len + len) % len;
}

export default function Gallery({ images = [], categories = ["All"], title = "Gallery" }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeCat, setActiveCat] = useState("All");

  const filtered = useMemo(() => {
    if (activeCat === "All") return images;
    return images.filter((img) => img.category === activeCat);
  }, [images, activeCat]);

  // ✅ Re-run reveal logic whenever the category (or number of tiles) changes
  useRevealOnScroll("[data-reveal]", [activeCat, filtered.length]);

  const active = useMemo(() => {
    if (activeIndex === null) return null;
    return filtered[clampIndex(activeIndex, filtered.length)];
  }, [activeIndex, filtered]);

  const close = useCallback(() => setActiveIndex(null), []);
  const prev = useCallback(
    () => setActiveIndex((i) => clampIndex((i ?? 0) - 1, filtered.length)),
    [filtered.length]
  );
  const next = useCallback(
    () => setActiveIndex((i) => clampIndex((i ?? 0) + 1, filtered.length)),
    [filtered.length]
  );

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeIndex, close, prev, next]);

  // Reset active image when category changes
  useEffect(() => {
    setActiveIndex(null);
  }, [activeCat]);

  if (!images.length) {
    return (
      <section className="section" data-reveal>
        <div className="container">
          <div className="section__header">
            <h2 className="h2">{title}</h2>
            <p className="muted">
              Add your images into <code>client/src/assets/gallery</code> and update{" "}
              <code>src/data/galleryAuto.js</code>.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section" data-reveal>
      <div className="container">
        <div className="section__header section__header--row">
          <div>
            <h2 className="h2">{title}</h2>
            <p className="muted">Tap an image to view. Use ← → keys to navigate. Press Esc to close.</p>
          </div>

          <div className="filters" role="tablist" aria-label="Gallery categories">
            {categories.map((c) => (
              <button
                key={c}
                className={`filter ${activeCat === c ? "is-active" : ""}`}
                onClick={() => setActiveCat(c)}
                type="button"
                role="tab"
                aria-selected={activeCat === c}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry */}
        <div className="masonry" role="list">
          {filtered.map((img, idx) => (
            <button
              key={img.src + idx}
              className="masonry__item"
              onClick={() => setActiveIndex(idx)}
              type="button"
              aria-label={img.alt ?? `Open image ${idx + 1}`}
              role="listitem"
              data-reveal
            >
              <img className="masonry__img" src={img.src} alt={img.alt ?? ""} loading="lazy" />
              <div className="masonry__meta" aria-hidden="true">
                <div className="masonry__cat">{img.category}</div>
                {img.caption && <div className="masonry__cap">{img.caption}</div>}
              </div>
              <span className="masonry__shine" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>

      {active && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer" onMouseDown={close}>
          <div className="lightbox__inner" onMouseDown={(e) => e.stopPropagation()}>
            <button className="iconbtn" type="button" onClick={close} aria-label="Close">
              ✕
            </button>
            <button className="iconbtn iconbtn--left" type="button" onClick={prev} aria-label="Previous">
              ‹
            </button>
            <button className="iconbtn iconbtn--right" type="button" onClick={next} aria-label="Next">
              ›
            </button>

            <figure className="lightbox__figure">
              <img className="lightbox__img" src={active.src} alt={active.alt ?? ""} />
              <figcaption className="lightbox__caption">
                <strong>{active.category}</strong>
                {active.caption ? ` — ${active.caption}` : ""}
              </figcaption>
            </figure>
          </div>
        </div>
      )}
    </section>
  );
}
