import { useEffect, useState, useMemo } from "react";
import bookings from "../data/bookings";
import {
  Calendar,
  type CalendarMonth,
} from "@demark-pro/react-booking-calendar";
import "@demark-pro/react-booking-calendar/dist/react-booking-calendar.css";
import { useTranslation } from "react-i18next";
import { clearTime, useMonthNames } from "../pages/admin/utils";
import useInView from "../hooks/useInView";
import Loader from "./Loader";
import BookingDayContent from "./BookingDayContent";

const today = clearTime(new Date());
const currYear = today.getFullYear();
const currMonth = today.getMonth() as CalendarMonth;
const years = [currYear, currYear + 1, currYear + 2];

function calcReserved(
  selectedMonth: number,
  bookedRanges: { start: Date; end: Date }[],
) {
  const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
  const nextMonth = selectedMonth === 11 ? 0 : selectedMonth + 1;

  return bookedRanges
    .filter((b) => {
      const min = Math.min(b.start.getMonth(), b.end.getMonth());
      const max = Math.max(b.start.getMonth(), b.end.getMonth());

      return min >= prevMonth || max <= nextMonth;
    })
    .map((b) => ({
      startDate: b.start,
      endDate: b.end,
      color: "white",
    }));
}

export default function Availability() {
  const monthNames = useMonthNames();
  const [bookedRanges, setBookedRanges] = useState<
    { start: Date; end: Date }[]
  >([]);
  const [selectedYear, setSelectedYear] = useState<number>(currYear);
  const [selectedMonth, setSelectedMonth] = useState<CalendarMonth>(currMonth);
  const { t } = useTranslation();
  const { ref: cardRef, inView: cardInView } = useInView();

  useEffect(() => {
    bookings.getBookedDates().then(setBookedRanges);
  }, []);

  const reserved = useMemo<{ startDate: Date; endDate: Date; color: string }[]>(
    () => calcReserved(selectedMonth, bookedRanges),
    [selectedYear, selectedMonth, cardInView],
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
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
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
                  return (
                    <option
                      key={i}
                      value={i}
                      disabled={selectedYear === currYear && i < currMonth}
                    >
                      {m}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="avail-calendar">
            {bookedRanges.length !== 0 ? (
              <Calendar
                className="avail-booking-calendar"
                selected={[]}
                reserved={reserved}
                onChange={() => {}}
                month={selectedMonth}
                year={selectedYear}
                onMonthChange={(m, y) => {
                  if (m < currMonth && y <= currYear) return;

                  setSelectedMonth(m);
                  setSelectedYear(y);
                }}
                options={{ weekStartsOn: 0, useAttributes: true }}
                disabled={() => true}
                components={{ DayContent: BookingDayContent }}
                classNames={{
                  MonthArrowBack: "avail-cal-arrow",
                  MonthArrowNext: "avail-cal-arrow",
                  MonthContent: "avail-cal-month",
                }}
              />
            ) : (
              Loader()
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
