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
      </div>
    </section>
  );
}
