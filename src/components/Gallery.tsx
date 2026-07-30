import { useState } from "react";
import { useTranslation } from "react-i18next";
import useInfo from "../data/information";
import useInView from "../hooks/useInView";

interface GalleryImage {
  url: string;
  caption: string;
}

function GalleryItem({
  img,
  i,
  onClick,
}: {
  img: GalleryImage;
  i: number;
  onClick: () => void;
}) {
  const { ref, inView } = useInView(0.1);
  return (
    <div
      ref={ref}
      className={`gallery-item gallery-item-${i + 1} animate-fade-in-up delay-${Math.min((i % 8) + 1, 8)} ${inView ? "visible" : ""}`}
      onClick={onClick}
    >
      <img src={img.url} alt={img.caption} loading="lazy" />
      <div className="gallery-overlay">
        <span className="gallery-caption">{img.caption}</span>
        <span className="gallery-expand">View</span>
      </div>
    </div>
  );
}

export default function Gallery() {
  const [selected, setSelected] = useState<GalleryImage | null>(null);
  const { galleryPage, galleryImages } = useInfo();
  const { ref: headerRef, inView: headerInView } = useInView();

  return (
    <section id="gallery" className="gallery">
      <div className="container">
        <div
          ref={headerRef}
          className={`section-header animate-fade-in-up ${headerInView ? "visible" : ""}`}
        >
          <h2 className="section-title">{galleryPage.title}</h2>
          <p className="section-desc">{galleryPage.description}</p>
        </div>

        <div className="gallery-grid">
          {galleryImages.map((img, i) => (
            <GalleryItem
              key={i}
              img={img}
              i={i}
              onClick={() => setSelected(img)}
            />
          ))}
        </div>
      </div>

      {selected && (
        <div className="lightbox" onClick={() => setSelected(null)}>
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="lightbox-close"
              onClick={() => setSelected(null)}
            >
              &times;
            </button>
            <img src={selected.url} alt={selected.caption} />
            <p className="lightbox-caption">{selected.caption}</p>
          </div>
        </div>
      )}
    </section>
  );
}
