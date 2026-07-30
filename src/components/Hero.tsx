import { useTranslation } from "react-i18next";
import useInfo from "../data/information";

export default function Hero() {
  const { t } = useTranslation();
  const { homePage } = useInfo();

  return (
    <section id="home" className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <p className="hero-tagline">{t("welcomeTo", "Welcome to")}</p>
        <h1 className="hero-title">{homePage.name}</h1>
        <p className="hero-subtitle">{homePage.description}</p>
        <div className="hero-buttons">
          <a href="#availability" className="btn btn-primary">
            {t("checkAvailability", "Check Availability")}
          </a>
          <a href="#gallery" className="btn btn-secondary">
            {t("exploreStudio", "Explore Studio")}
          </a>
        </div>
        <div className="hero-scroll">
          <span>{t("scrollToExplore", "Scroll to explore")}</span>
          <div className="scroll-line"></div>
        </div>
      </div>
    </section>
  );
}
