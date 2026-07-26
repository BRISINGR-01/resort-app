import { text } from "../data/text";

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <p className="hero-tagline">Welcome to</p>
        <h1 className="hero-title">{text.homePage.name}</h1>
        <p className="hero-subtitle">{text.homePage.description}</p>
        <div className="hero-buttons">
          <a href="#availability" className="btn btn-primary">
            Check Availability
          </a>
          <a href="#gallery" className="btn btn-secondary">
            Explore Studio
          </a>
        </div>
        <div className="hero-scroll">
          <span>Scroll to explore</span>
          <div className="scroll-line"></div>
        </div>
      </div>
    </section>
  );
}
