import { useState } from "react";
import { availability } from "../data";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getMonthMeta(month) {
  const [name, yearStr] = month.split(" ");
  const monthNum = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ].indexOf(name);
  const year = parseInt(yearStr);
  const firstDay = new Date(year, monthNum, 1).getDay();
  const totalDays = new Date(year, monthNum + 1, 0).getDate();
  return { name, year, monthNum, firstDay, totalDays };
}

function Calendar({ month, days, status }) {
  const { name, year, firstDay } = getMonthMeta(month);

  return (
    <div className="calendar-panel">
      <div className="calendar-header">
        <h3 className="calendar-title">
          {name} {year}
        </h3>
        <span className={`avail-badge badge-${status}`}>
          {status === "available" && "Open"}
          {status === "limited" && "Limited"}
          {status === "booked" && "Mostly Booked"}
        </span>
      </div>

      <div className="calendar-weekdays">
        {DAY_LABELS.map((d) => (
          <span key={d} className="cal-weekday">
            {d}
          </span>
        ))}
      </div>

      <div className="calendar-days">
        {Array.from({ length: firstDay }, (_, i) => (
          <span key={`empty-${i}`} className="cal-day cal-day-empty"></span>
        ))}
        {days.map((status, i) => (
          <span key={i} className={`cal-day cal-day-${status}`}>
            <span className="cal-day-num">{i + 1}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Availability() {
  const [selected, setSelected] = useState(null);

  const handleSelect = (index) => {
    setSelected(selected === index ? null : index);
  };

  return (
    <section id="availability" className="availability">
      <div className="container">
        <div className="section-header">
          <p className="section-label">Availability</p>
          <h2 className="section-title">
            Plan Your <em>Escape</em>
          </h2>
          <p className="section-desc">
            Secure your dates for an unforgettable coastal experience. Book
            early for the best selection of available weeks.
          </p>
        </div>

        <div className="pricing-card">
          <div className="pricing-header">
            <div className="pricing-price">
              <span className="currency">$</span>
              <span className="amount">285</span>
              <span className="period">/ night</span>
            </div>
            <p className="pricing-note">
              Minimum 3-night stay &middot; Weekly discounts available
            </p>
          </div>

          <div className="availability-grid">
            {availability.map((item, i) => (
              <div
                key={i}
                className={`avail-item avail-${item.status} ${selected === i ? "avail-selected" : ""}`}
                onClick={() => handleSelect(i)}
              >
                <span className="avail-month">{item.month}</span>
                <span className={`avail-badge badge-${item.status}`}>
                  {item.status === "available" && `${item.spots} spots open`}
                  {item.status === "limited" && `${item.spots} spots left`}
                  {item.status === "booked" && "Fully Booked"}
                </span>
                <span className="avail-click-hint">
                  {selected === i ? "Click to close" : "Click to view calendar"}
                </span>
              </div>
            ))}
          </div>

          {selected !== null && (
            <Calendar
              month={availability[selected].month}
              days={availability[selected].days}
              status={availability[selected].status}
            />
          )}

          <div className="pricing-footer">
            <div className="legend">
              <span className="legend-item">
                <span className="legend-dot dot-available"></span> Available
              </span>
              <span className="legend-item">
                <span className="legend-dot dot-booked"></span> Booked
              </span>
            </div>
            <a href="#contact" className="btn btn-primary">
              Reserve Your Stay
            </a>
          </div>
        </div>

        <div className="features-row">
          <div className="feature-card">
            <div className="feature-icon">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3>Free Cancellation</h3>
            <p>Cancel up to 7 days before check-in for a full refund.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3>Best Price Guarantee</h3>
            <p>Found it cheaper? We'll match it and add a 5% discount.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h3>Concierge Service</h3>
            <p>Our local team handles everything from excursions to dining.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
