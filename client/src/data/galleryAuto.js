/**
 * Auto-load gallery images at build time using Vite.
 *
 * Filename prefixes map to categories:
 * brows-*.jpg -> Brows
 * waxing-*.jpg -> Waxing
 * facials-*.jpg -> Facials
 * results-*.jpg -> Results
 */

const modules = import.meta.glob("../assets/gallery/*.{jpg,jpeg,png,webp}", { eager: true, query: "?url", import: "default" });

function toCategory(filename){
  const lower = filename.toLowerCase();
  if (lower.startsWith("brows-")) return "Brows";
  if (lower.startsWith("waxing-")) return "Waxing";
  if (lower.startsWith("facials-")) return "Facials";
  if (lower.startsWith("results-")) return "Results";
  return "Results";
}

function titleFrom(filename){
  const base = filename.replace(/\.[^.]+$/, "");
  return base.replace(/[-_]+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

export const galleryCategories = ["All", "Brows", "Waxing", "Facials", "Results"];

export const galleryImages = Object.entries(modules)
  .map(([path, url]) => {
    const filename = path.split("/").pop() || "image";
    const category = toCategory(filename);
    return {
      src: url,
      alt: titleFrom(filename),
      category,
      caption: titleFrom(filename)
    };
  })
  .sort((a,b) => a.caption.localeCompare(b.caption));
