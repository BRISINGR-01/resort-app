import { useEffect, useRef, useState } from "react";
import bookings from "../data/bookings";
import CalendarGrid from "./CalendarGrid";
import type { AvailabilityMonth, Status } from "../data/types";
import { useTranslation } from "react-i18next";
import { useMonthNames } from "../pages/admin/utils";

function getMonthMeta(month: string, monthNames: string[]) {
  const [name, yearStr] = month.split(" ");
  const monthNum = monthNames.indexOf(name);
  return { name, year: parseInt(yearStr), monthNum };
}

interface CalendarPanelProps {
  ref: React.RefObject<HTMLDivElement | null>;
  month: string;
  days: Status[];
  status: "available" | "limited" | "booked";
  monthNames: string[];
}

const CalendarPanel = ({
  ref,
  month,
  days,
  status,
  monthNames,
}: CalendarPanelProps) => {
  const { name, year, monthNum } = getMonthMeta(month, monthNames);

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
  const monthNames = useMonthNames();
  const [selected, setSelected] = useState<number | null>(null);
  const [availability, setAvailability] = useState<AvailabilityMonth[]>([]);
  const calendarRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    bookings.availability(monthNames).then(setAvailability);
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
          <p className="section-label">{t("availability", "Availability")}</p>
        </div>

        <div className="pricing-card">
          {/* <div className="pricing-header">
            <div className="pricing-price">
              <span className="currency">{"\u20AC"}</span>
              <span className="amount">{100}</span>
              <span className="period">/ night</span>
            </div>
          </div> */}

          <div className="availability-grid">
            {availability.map((item, i) => (
              <div
                key={i}
                className={`avail-item avail-${item.status} ${selected === i ? "avail-selected" : ""}`}
                onClick={() => handleSelect(i)}
              >
                <span className="avail-month">{item.month}</span>
                <span className={`avail-badge badge-${item.status}`}>
                  {item.status === "available" &&
                    t("spotsSpotsOpen", "{{spots}} spots open", {
                      spots: item.spots,
                    })}
                  {item.status === "limited" &&
                    t("spotsSpotsLeft", "{{spots}} spots left", {
                      spots: item.spots,
                    })}
                  {item.status === "booked" && "Fully Booked"}
                </span>
                <span className="avail-click-hint">
                  {selected === i
                    ? t("clickToClose", "Click to close")
                    : t("clickToViewCalendar", "Click to view calendar")}
                </span>
              </div>
            ))}
          </div>

          {selected !== null && availability[selected] && (
            <CalendarPanel
              monthNames={monthNames}
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
