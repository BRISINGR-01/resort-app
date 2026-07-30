import { Link } from "react-router-dom";
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
                <Link to="/">{t("home", "Home")}</Link>
              </li>
              <li>
                <Link to="/gallery">{t("gallery", "Gallery")}</Link>
              </li>
              <li>
                <Link to="/reservation">{t("availability", "Availability")}</Link>
              </li>
              <li>
                <Link to="/contact">{t("contact", "Contact")}</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
