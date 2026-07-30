import { useState } from "react";
import { galleryImages } from "../data/galleryImages";
import { text } from "../data/text";

interface GalleryImage {
  url: string;
  caption: string;
}

export default function Gallery() {
  const [selected, setSelected] = useState<GalleryImage | null>(null);

  return (
    <section id="gallery" className="gallery">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{text.galleryPage.title}</h2>
          <p className="section-desc">{text.galleryPage.description}</p>
        </div>

        <div className="gallery-grid">
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className={`gallery-item gallery-item-${i + 1}`}
              onClick={() => setSelected(img)}
            >
              <img src={img.url} alt={img.caption} loading="lazy" />
              <div className="gallery-overlay">
                <span className="gallery-caption">{img.caption}</span>
                <span className="gallery-expand">View</span>
              </div>
            </div>
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
