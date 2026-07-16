import { amenities } from "../data";

export default function About() {
  return (
    <section className="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-images">
            <div className="about-img-main">
              <img
                src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80"
                alt="Luxury studio interior"
              />
            </div>
            <div className="about-img-accent">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80"
                alt="Beach view"
              />
            </div>
            <div className="about-badge">
              <span className="badge-number">12+</span>
              <span className="badge-text">Years of Hospitality</span>
            </div>
          </div>
          <div className="about-content">
            <p className="section-label">Our Story</p>
            <h2 className="section-title">
              Where Luxury Meets <em>Tranquility</em>
            </h2>
            <p className="about-text">
              Nestled along a pristine stretch of coastline, Coral Bay Studios
              offers an intimate escape from the ordinary. Our boutique studio
              combines contemporary elegance with the natural beauty of the
              tropics, creating a sanctuary where every moment feels like a
              getaway.
            </p>
            <p className="about-text">
              Wake to the sound of gentle waves, enjoy your morning coffee
              overlooking the azure sea, and spend your days exploring hidden
              coves and vibrant coral reefs. This is not just a place to stay —
              it's a place to truly live.
            </p>
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
        </div>
      </div>
    </section>
  );
}
