import { useTranslation } from "react-i18next";
import useInfo from "../data/information";
import useInView from "../hooks/useInView";

function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className={`animate-fade-in-up delay-${delay} ${inView ? "visible" : ""} ${className}`}>
      {children}
    </div>
  );
}

export default function About() {
  const { t } = useTranslation();
  const { aboutPage, amenities } = useInfo();
  const { ref: gridRef, inView: gridInView } = useInView();

  return (
    <section className="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-left-side" ref={gridRef}>
            <div className="about-images">
              <div className={`about-img-main animate-scale-in ${gridInView ? "visible" : ""}`}>
                <img
                  src="gallery/room/1.jpg"
                  alt={t("luxuryStudioInterior", "Luxury studio interior")}
                />
              </div>
              <div className={`about-img-accent animate-scale-in delay-2 ${gridInView ? "visible" : ""}`}>
                <img
                  src="gallery/beach/1.jpg"
                  alt={t("beachView", "Beach view")}
                />
              </div>
            </div>
            <div className="amenities-grid">
              {amenities.map((item, i) => (
                <div key={i} className={`amenity-item animate-fade-in-up delay-${Math.min(i + 1, 8)} ${gridInView ? "visible" : ""}`}>
                  <span className="amenity-icon">
                    <img
                      style={{ height: "1em" }}
                      src={item.icon}
                      alt={item.icon}
                    />
                  </span>
                  <span className="amenity-label">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <AnimatedSection className="about-content" delay={1}>
            <h2 className="section-title">{aboutPage.greeting}</h2>
            <p className="about-text">{aboutPage.description}</p>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
