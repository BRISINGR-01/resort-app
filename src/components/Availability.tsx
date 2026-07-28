import { useEffect, useRef, useState } from "react";
import bookings from "../data/bookings";
import { basicInformation } from "../data/basicInformation";
import CalendarGrid from "./CalendarGrid";
import type { AvailabilityMonth, Status } from "../data/types";

const MONTH_NAMES = [
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
];

function getMonthMeta(month: string) {
  const [name, yearStr] = month.split(" ");
  const monthNum = MONTH_NAMES.indexOf(name);
  return { name, year: parseInt(yearStr), monthNum };
}

interface CalendarPanelProps {
  ref: React.RefObject<HTMLDivElement | null>;
  month: string;
  days: Status[];
  status: "available" | "limited" | "booked";
}

const CalendarPanel = ({ ref, month, days, status }: CalendarPanelProps) => {
  const { name, year, monthNum } = getMonthMeta(month);

  return (
    <div className="calendar-panel" ref={ref}>
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

      <CalendarGrid
        year={year}
        month={monthNum}
        renderDay={(day) => {
          const dayStatus = days[day - 1] || "available";
          return (
            <span className={`cal-day cal-day-${dayStatus}`}>
              <span className="cal-day-num">{day}</span>
            </span>
          );
        }}
      />
    </div>
  );
};

export default function Availability() {
  const [selected, setSelected] = useState<number | null>(null);
  const [availability, setAvailability] = useState<AvailabilityMonth[]>([]);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bookings.availability().then(setAvailability);
  }, []);

  const handleSelect = (index: number) => {
    setSelected(selected === index ? null : index);
  };

  useEffect(() => {
    if (selected !== null && calendarRef.current)
      setTimeout(() => {
        if (calendarRef.current)
          calendarRef.current.scrollIntoView({
            block: "center",
            inline: "nearest",
            behavior: "smooth",
          });
      }, 250);
  }, [selected]);

  return (
    <section id="availability" className="availability">
      <div className="container">
        <div className="section-header">
          <p className="section-label">Availability</p>
        </div>

        <div className="pricing-card">
          <div className="pricing-header">
            <div className="pricing-price">
              <span className="currency">{"\u20AC"}</span>
              <span className="amount">{basicInformation.cost}</span>
              <span className="period">/ night</span>
            </div>
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

          {selected !== null && availability[selected] && (
            <CalendarPanel
              ref={calendarRef}
              month={availability[selected].month}
              days={availability[selected].days}
              status={availability[selected].status}
            />
          )}
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
