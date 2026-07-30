import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useInfo from "../data/information";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { homePage } = useInfo();

  const toggleLanguage = () => {
    const next = i18n.resolvedLanguage === "bg" ? "en" : "bg";
    i18n.changeLanguage(next);
    localStorage.setItem("lang", next);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        <a href="#home" className="nav-logo">
          <span className="logo-icon">
            <img
              style={{ height: "80%", transform: "translateY(-3px)" }}
              src="icon.svg"
              alt="logo"
            />
          </span>
          <span className="logo-text">{homePage.name}</span>
        </a>

        <button
          className={`nav-toggle ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li>
            <a href="#home" onClick={() => setMenuOpen(false)}>
              {t("home", "Home")}
            </a>
          </li>
          <li>
            <a href="#gallery" onClick={() => setMenuOpen(false)}>
              {t("gallery", "Gallery")}
            </a>
          </li>
          <li>
            <a href="#availability" onClick={() => setMenuOpen(false)}>
              {t("availability", "Availability")}
            </a>
          </li>
          <li>
            <a href="#contact" onClick={() => setMenuOpen(false)}>
              {t("contact", "Contact")}
            </a>
          </li>
          <button className="lang-switch" onClick={toggleLanguage}>
            <img
              src={
                i18n.resolvedLanguage === "bg" ? "icons/en.svg" : "icons/bg.svg"
              }
              alt={i18n.resolvedLanguage === "bg" ? "English" : "Български"}
            />
          </button>
        </ul>
      </div>
    </nav>
  );
}
