import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useInfo from "../data/information";
import useInView from "../hooks/useInView";

export default function Hero() {
  const { t } = useTranslation();
  const { homePage } = useInfo();
  const { ref, inView } = useInView(0.3);

  return (
    <section id="home" className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-content" ref={ref}>
        <h1
          className={`hero-title animate-fade-in-up delay-1 ${inView ? "visible" : ""}`}
        >
          {homePage.name}
        </h1>
        <p
          className={`hero-subtitle animate-fade-in-up delay-2 ${inView ? "visible" : ""}`}
        >
          {homePage.description}
        </p>
        <div
          className={`hero-buttons animate-fade-in-up delay-3 ${inView ? "visible" : ""}`}
        >
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
