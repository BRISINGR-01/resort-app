import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import useInfo from "../data/information";

interface GalleryImage {
  url: string;
  caption: string;
  category: string;
}

interface GalleryRowProps {
  category: string;
  images: GalleryImage[];
  onSelect: (img: GalleryImage) => void;
}

const CATEGORY_ORDER = ["room", "complex", "beach"];

const CATEGORY_LABELS: Record<string, string> = {
  room: "studio",
  complex: "complex",
  beach: "beach",
};

function GalleryRow({ category, images, onSelect }: GalleryRowProps) {
  const { t } = useTranslation();

  return (
    <div className="gallery-row gallery-fade-in">
      <h3 className="gallery-row-title">
        {t(CATEGORY_LABELS[category], category)}
      </h3>
      <Swiper
        modules={[Autoplay, Navigation]}
        navigation
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        slidesPerView={1.5}
        spaceBetween={16}
        breakpoints={{
          768: { slidesPerView: 2.5 },
          1100: { slidesPerView: 3.5 },
        }}
        className="gallery-swiper"
      >
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            <div className="gallery-slide" onClick={() => onSelect(img)}>
              <img
                src={img.url}
                alt={img.caption}
                className="gallery-slide-img"
              />
              <div className="gallery-slide-overlay">
                <span className="gallery-slide-label">{img.caption}</span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default function Gallery() {
  const [selected, setSelected] = useState<GalleryImage | null>(null);
  const { galleryPage, galleryImages } = useInfo();
  const images = galleryImages as GalleryImage[];

  const grouped = useMemo(() => {
    const map: Record<string, GalleryImage[]> = {};
    for (const img of images) {
      (map[img.category] ||= []).push(img);
    }
    return map;
  }, [images]);

  const categories = useMemo(
    () => CATEGORY_ORDER.filter((cat) => grouped[cat]?.length),
    [grouped],
  );

  return (
    <section id="gallery" className="gallery">
      <div className="container">
        <div className="section-header gallery-fade-in">
          <h2 className="section-title">{galleryPage.title}</h2>
          <p className="section-desc">{galleryPage.description}</p>
        </div>

        {categories.map((cat) => (
          <GalleryRow
            key={cat}
            category={cat}
            images={grouped[cat]}
            onSelect={setSelected}
          />
        ))}
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
