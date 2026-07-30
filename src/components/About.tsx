import { useTranslation } from "react-i18next";
import useInfo from "../data/information";

export default function About() {
  const { t } = useTranslation();
  const { aboutPage, amenities } = useInfo();

  return (
    <section className="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-left-side">
            <div className="about-images">
              <div className="about-img-main">
                <img
                  src="gallery/room/1.jpg"
                  alt={t("luxuryStudioInterior", "Luxury studio interior")}
                />
              </div>
              <div className="about-img-accent">
                <img
                  src="gallery/beach/1.jpg"
                  alt={t("beachView", "Beach view")}
                />
              </div>
            </div>
            <div className="amenities-grid">
              {amenities.map((item, i) => (
                <div key={i} className="amenity-item">
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
          <div className="about-content">
            <h2 className="section-title">{aboutPage.greeting}</h2>
            <p className="about-text">{aboutPage.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
