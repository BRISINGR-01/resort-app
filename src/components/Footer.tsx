import { useTranslation } from "react-i18next";
import useInfo from "../data/information";

export default function Footer() {
  const { t } = useTranslation();
  const { homePage } = useInfo();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="nav-logo">
              <span className="logo-icon">C</span>
              <span className="logo-text">{homePage.name}</span>
            </div>
            <p>{homePage.description}</p>
          </div>
          <div className="footer-links">
            <h4>{t("quickLinks", "Quick Links")}</h4>
            <ul>
              <li>
                <a href="#home">{t("home", "Home")}</a>
              </li>
              <li>
                <a href="#gallery">{t("gallery", "Gallery")}</a>
              </li>
              <li>
                <a href="#availability">{t("availability", "Availability")}</a>
              </li>
              <li>
                <a href="#contact">{t("contact", "Contact")}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
