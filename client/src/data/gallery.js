import { useMemo, useState } from "react";
import useRevealOnScroll from "../components/useRevealOnScroll"; // adjust path if needed

export default function Gallery({ images = [], categories = [], title = "Gallery" }) {
  const [activeCategory, setActiveCategory] = useState("All");

  // 👇 THIS is the fix — rerun reveal logic when category changes
  useRevealOnScroll("[data-reveal]", [activeCategory]);

  const filteredImages = useMemo(() => {
    if (activeCategory === "All") return images;
    return images.filter((img) => img.category === activeCategory);
  }, [images, activeCategory]);

  return (
    <section className="gallery">
      <div className="container">
        <div className="gallery__header" data-reveal>
          <h2 className="h2">{title}</h2>

          <div className="gallery__filters" role="tablist" aria-label="Gallery categories">
            {categories.map((cat) => {
              const isActive = cat === activeCategory;

              return (
                <button
                  key={cat}
                  type="button"
                  className={`gallery__filterBtn ${isActive ? "is-active" : ""}`}
                  onClick={() => setActiveCategory(cat)}
                  role="tab"
                  aria-selected={isActive}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {filteredImages.length === 0 ? (
          <p className="muted" style={{ marginTop: 12 }}>
            No photos in this category yet.
          </p>
        ) : (
          <div className="gallery__grid" style={{ marginTop: 16 }}>
            {filteredImages.map((img) => (
              <figure className="gallery__item" key={img.src} data-reveal>
                <img
                  className="gallery__img"
                  src={img.src}
                  alt={img.alt || img.caption || "Gallery photo"}
                  loading="lazy"
                />
                {img.caption ? <figcaption className="gallery__caption">{img.caption}</figcaption> : null}
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
