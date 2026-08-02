import { useEffect, useState, useMemo } from "react";
import bookings from "../data/bookings";
import {
  Calendar,
  type CalendarMonth,
} from "@demark-pro/react-booking-calendar";
import "@demark-pro/react-booking-calendar/dist/react-booking-calendar.css";
import { useTranslation } from "react-i18next";
import { clearTime, useMonthNames } from "../pages/admin/utils";
import Loader from "./Loader";
import BookingDayContent from "./BookingDayContent";
import { useToast } from "./Toast";
import type { PricesData } from "../data/types";
import prices from "../data/prices";
import useInfo from "../data/information";

const today = clearTime(new Date());
const currYear = today.getFullYear();
const currMonth = today.getMonth() as CalendarMonth;
const years = [currYear, currYear + 1, currYear + 2];

const prevMonth = (m: number) => (m === 0 ? 11 : m - 1);
const nextMonth = (m: number) => (m === 11 ? 0 : m + 1);

function calcReserved(
  selectedMonth: number,
  bookedRanges: { start: Date; end: Date }[],
) {
  const prevM = prevMonth(selectedMonth);
  const nextM = nextMonth(selectedMonth);

  return bookedRanges
    .filter((b) => {
      const min = Math.min(b.start.getMonth(), b.end.getMonth());
      const max = Math.max(b.start.getMonth(), b.end.getMonth());

      return min >= prevM || max <= nextM;
    })
    .map((b) => ({
      startDate: b.start,
      endDate: b.end,
      color: "white",
    }));
}

export default function Availability() {
  const monthNames = useMonthNames();
  const { t } = useTranslation();
  const { toastError } = useToast();
  const { defaultPrice } = useInfo();
  const [bookedRanges, setBookedRanges] = useState<
    { start: Date; end: Date }[]
  >([]);
  const [selectedYear, setSelectedYear] = useState<number>(currYear);
  const [selectedMonth, setSelectedMonth] = useState<CalendarMonth>(currMonth);
  const [dayPrices, setDayPrices] = useState<PricesData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    bookings.getBookedDates().then(({ data: ranges, error }) => {
      if (error) {
        toastError(
          error?.message ||
            t("failedToLoadAvailability", "Failed to load availability"),
        );
      } else {
        setBookedRanges(ranges ?? []);
      }
      setLoading(false);
    });
  }, [toastError, t]);

  useEffect(() => {
    prices
      .getPrices(
        new Date(1, prevMonth(selectedMonth), selectedYear),
        new Date(1, nextMonth(selectedMonth), selectedYear),
      )
      .then(({ data, error }) => {
        if (error) {
          toastError(
            error.message || t("failedToLoadPrices", "Failed to load prices"),
          );
        } else {
          setDayPrices(data ?? []);
        }
      });
  }, [selectedMonth, selectedYear, toastError, t]);

  const reserved = useMemo<{ startDate: Date; endDate: Date; color: string }[]>(
    () => calcReserved(selectedMonth, bookedRanges),
    [selectedYear, selectedMonth, bookedRanges],
  );

  return (
    <section id="availability" className="availability">
      <div className="container">
        <div className="pricing-card animate-fade-in">
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
            {loading ? (
              Loader()
            ) : (
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
                components={{
                  DayContent: (props) =>
                    BookingDayContent({ ...props, dayPrices, defaultPrice }),
                }}
                classNames={{
                  MonthArrowBack: "avail-cal-arrow",
                  MonthArrowNext: "avail-cal-arrow",
                  MonthContent: "avail-cal-month",
                }}
              />
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
