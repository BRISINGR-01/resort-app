import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useInfo from "../data/information";
import useInView from "../hooks/useInView";

export default function LocationPage() {
  const { t } = useTranslation();
  const { contact } = useInfo();
  const { ref, inView } = useInView();

  return (
    <>
      <Navbar />

      <section className="location">
        <div className="container">
          <div className="location-container">
            <div
              ref={ref}
              className={`location-info animate-fade-in-up ${inView ? "visible" : ""}`}
            >
              <h1 className="location-header">{t("location", "Location")}</h1>
              <p className="location-sentence">
                {t(
                  "tenMinutesFromKavaciBeach",
                  "10 min away from the Kavaci beach",
                )}
              </p>
              <a
                className="btn btn-primary"
                style={{
                  boxShadow: "0px 0px 7px 0px #949494",
                }}
                href={contact.location.maps}
                target="_blank"
                rel="noreferrer"
              >
                {t("openInGoogleMaps", "Open in Google Maps")}
              </a>
            </div>

            <div
              className={`location-map animate-fade-in-up ${inView ? "visible delay-1" : ""}`}
            >
              <iframe
                title="Google Maps"
                src={contact.location.embed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
