import { useState } from 'react';
import { galleryImages } from '../data';

export default function Gallery() {
  const [selected, setSelected] = useState(null);

  return (
    <section id="gallery" className="gallery">
      <div className="container">
        <div className="section-header">
          <p className="section-label">Gallery</p>
          <h2 className="section-title">A Glimpse of <em>Paradise</em></h2>
          <p className="section-desc">
            Every corner tells a story. Explore our studio, the resort grounds,
            and the breathtaking natural beauty that surrounds us.
          </p>
        </div>

        <div className="gallery-grid">
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className={`gallery-item gallery-item-${i + 1}`}
              onClick={() => setSelected(img)}
            >
              <img src={img.url} alt={img.alt} loading="lazy" />
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
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setSelected(null)}>
              &times;
            </button>
            <img src={selected.url} alt={selected.alt} />
            <p className="lightbox-caption">{selected.caption}</p>
          </div>
        </div>
      )}
    </section>
  );
}
