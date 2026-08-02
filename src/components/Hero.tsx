import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useInfo from "../data/information";

export default function Hero() {
  const { t } = useTranslation();
  const { homePage } = useInfo();

  return (
    <section id="home" className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className={`hero-title animate-fade-in-up delay-1`}>
          {homePage.name}
        </h1>
        <p className={`hero-subtitle animate-fade-in-up delay-2`}>
          {homePage.description}
        </p>
        <div className={`hero-buttons animate-fade-in-up delay-3`}>
          <Link to="/gallery" className="btn btn-secondary">
            {t("exploreStudio", "Explore Studio")}
          </Link>
          <Link to="/reservation" className="btn btn-primary">
            {t("checkAvailability", "Check Availability")}
          </Link>
        </div>
      </div>
    </section>
  );
}
