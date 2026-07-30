import { useEffect, useState, useMemo } from "react";
import bookings from "../data/bookings";
import {
  Calendar,
  type CalendarMonth,
} from "@demark-pro/react-booking-calendar";
import "@demark-pro/react-booking-calendar/dist/react-booking-calendar.css";
import type { AvailabilityMonth, Status } from "../data/types";
import { useTranslation } from "react-i18next";
import { useMonthNames } from "../pages/admin/utils";
import useInView from "../hooks/useInView";

function daysToReserved(days: Status[], year: number, month: number) {
  const reserved: { startDate: Date; endDate: Date; color: string }[] = [];
  let start: number | null = null;
  for (let i = 0; i < days.length; i++) {
    if (days[i] === "booked" && start === null) start = i + 1;
    else if (days[i] !== "booked" && start !== null) {
      reserved.push({
        startDate: new Date(year, month, start),
        endDate: new Date(year, month, i + 1),
        color: "#fce4ec",
      });
      start = null;
    }
  }
  if (start !== null) {
    reserved.push({
      startDate: new Date(year, month, start),
      endDate: new Date(year, month, days.length + 1),
      color: "#fce4ec",
    });
  }
  return reserved;
}

export default function Availability() {
  const monthNames = useMonthNames();
  const [availability, setAvailability] = useState<AvailabilityMonth[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(0);
  const [selectedMonth, setSelectedMonth] = useState<CalendarMonth>(0);
  const { t } = useTranslation();
  const { ref: cardRef, inView: cardInView } = useInView();

  useEffect(() => {
    bookings.availability(monthNames).then((data) => {
      setAvailability(data);
      if (data.length > 0) {
        const [name, yearStr] = data[0].month.split(" ");
        setSelectedYear(parseInt(yearStr));
        setSelectedMonth(monthNames.indexOf(name) as CalendarMonth);
      }
    });
  }, []);

  const years = [
    ...new Set(
      availability.map((a) => {
        const [, yearStr] = a.month.split(" ");
        return parseInt(yearStr);
      }),
    ),
  ];

  const monthsForYear = availability.filter((a) =>
    a.month.endsWith(` ${selectedYear}`),
  );

  const selectedData = availability.find(
    (a) => a.month === `${monthNames[selectedMonth]} ${selectedYear}`,
  );

  const reserved = useMemo(
    () =>
      selectedData
        ? daysToReserved(selectedData.days, selectedYear, selectedMonth)
        : [],
    [selectedData, selectedYear, selectedMonth],
  );

  return (
    <section id="availability" className="availability">
      <div className="container">
        <div
          ref={cardRef}
          className={`pricing-card animate-fade-in-up ${cardInView ? "visible" : ""}`}
        >
          <div className="avail-controls">
            <div className="avail-select-group">
              <select
                value={selectedYear}
                onChange={(e) => {
                  const y = parseInt(e.target.value);
                  setSelectedYear(y);
                  const first = availability.find((a) =>
                    a.month.endsWith(` ${y}`),
                  );
                  if (first) {
                    const [name] = first.month.split(" ");
                    setSelectedMonth(monthNames.indexOf(name) as CalendarMonth);
                  }
                }}
                className="avail-select"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <select
                value={selectedMonth}
                onChange={(e) =>
                  setSelectedMonth(parseInt(e.target.value) as CalendarMonth)
                }
                className="avail-select"
              >
                {monthNames.map((m, i) => {
                  const disabled = !monthsForYear.some((a) =>
                    a.month.startsWith(m),
                  );
                  return (
                    <option key={i} value={i} disabled={disabled}>
                      {m}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="avail-calendar">
            {selectedData ? (
              <Calendar
                className="avail-booking-calendar"
                selected={[]}
                reserved={reserved}
                onChange={() => {}}
                month={selectedMonth}
                year={selectedYear}
                onMonthChange={(m, y) => {
                  setSelectedMonth(m);
                  setSelectedYear(y);
                }}
                options={{ weekStartsOn: 0, useAttributes: true }}
                disabled={() => true}
                classNames={{
                  MonthArrowBack: "avail-cal-arrow",
                  MonthArrowNext: "avail-cal-arrow",
                  MonthContent: "avail-cal-month",
                }}
              />
            ) : (
              <p className="avail-empty">
                {t("noData", "No availability data")}
              </p>
            )}
          </div>

          <div className="calendar-legend">
            <div className="cal-legend-item">
              <span className="cal-legend-swatch swatch-available" />
              {t("available", "Available")}
            </div>
            <div className="cal-legend-item">
              <span className="cal-legend-swatch swatch-booked" />
              {t("booked", "Booked")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
