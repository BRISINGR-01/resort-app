import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Calendar,
  type CalendarMonth,
  type CalendarReserved,
  type DayContainerProps,
  type DayContentProps,
} from "@demark-pro/react-booking-calendar";
import "@demark-pro/react-booking-calendar/dist/react-booking-calendar.css";
import bookings from "../../data/bookings";
import prices from "../../data/prices";
import useInfo from "../../data/information";
import { clearTime, formatDate, useMonthNames } from "./utils";
import EditBookingModal from "./EditBookingModal";
import AddBookingModal from "./AddBookingModal";
import PriceModal from "./PriceModal";
import type { Booking, PricesData } from "../../data/types";
import { useTranslation } from "react-i18next";
import Loader from "../../components/Loader";
import BookingDayContent from "../../components/BookingDayContent";
import { useToast } from "../../components/Toast";

interface VisitorColor {
  bg: string;
  bar: string;
  dot: string;
}

const VISITOR_COLORS: VisitorColor[] = [
  { bg: "#e8f0e4", bar: "#5a8a4e", dot: "#5a8a4e" },
  { bg: "#e4ecf5", bar: "#4a6fa5", dot: "#4a6fa5" },
  { bg: "#f5ece4", bar: "#a07040", dot: "#a07040" },
  { bg: "#f0e4f0", bar: "#8a5a8a", dot: "#8a5a8a" },
  { bg: "#e4f2f2", bar: "#4a8a8a", dot: "#4a8a8a" },
  { bg: "#f5f0e0", bar: "#8a7a3a", dot: "#8a7a3a" },
  { bg: "#f2e4ea", bar: "#9a5a70", dot: "#9a5a70" },
  { bg: "#e4eaf0", bar: "#5a6a8a", dot: "#5a6a8a" },
];

const today = clearTime(new Date());
const currYear = today.getFullYear();
const currMonth = today.getMonth() as CalendarMonth;
const years = [currYear, currYear + 1, currYear + 2];

const prevMonth = (m: number) => (m === 0 ? 11 : m - 1);
const nextMonth = (m: number) => (m === 11 ? 0 : m + 1);

export default function CalendarTab() {
  const { t } = useTranslation();
  const { toastError } = useToast();
  const { defaultPrice } = useInfo();
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [dayPrices, setDayPrices] = useState<PricesData[]>([]);
  const [loading, setLoading] = useState(true);
  const now = new Date();
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [editing, setEditing] = useState<Booking | null>(null);
  const [adding, setAdding] = useState(false);
  const [priceEditing, setPriceEditing] = useState(false);
  const [selection, setSelection] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const monthNames = useMonthNames();

  const loadBookings = useCallback(() => {
    bookings.list().then(({ data, error }) => {
      if (error) {
        toastError(
          error.message || t("failedToLoadBookings", "Failed to load bookings"),
        );
      } else {
        setAllBookings(data || []);
      }
      setLoading(false);
    });
  }, [toastError, t]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const loadPrices = useCallback(() => {
    prices
      .getPrices(
        new Date(viewYear, prevMonth(viewMonth), 1),
        new Date(viewYear, nextMonth(viewMonth), 1),
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
  }, [viewMonth, viewYear, toastError, t]);

  useEffect(() => {
    loadPrices();
  }, [loadPrices]);

  const bookingsInView = useMemo(() => {
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const monthStart = new Date(viewYear, viewMonth, 1);
    const monthEnd = new Date(viewYear, viewMonth, daysInMonth);
    return allBookings.filter(
      (b) => b.start_date <= monthEnd && b.end_date >= monthStart,
    );
  }, [allBookings, viewMonth, viewYear]);

  const colorMap = useMemo(() => {
    const map: Record<string, VisitorColor> = {};
    bookingsInView.forEach((b, i) => {
      map[b.id] = VISITOR_COLORS[i % VISITOR_COLORS.length];
    });
    return map;
  }, [bookingsInView]);

  const reserved = useMemo<CalendarReserved[]>(
    () =>
      bookingsInView.map((b) => ({
        startDate: b.start_date,
        endDate: b.end_date,
        color: colorMap[b.id]?.bar ?? "#5a8a4e",
      })),
    [bookingsInView, colorMap],
  );

  const handleDayClick = useCallback(
    (date: Date) => {
      const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const found = allBookings.find(
        (b) => b.start_date <= day && b.end_date >= day,
      );
      if (found) {
        setEditing(found);
        return;
      }

      const [start, end] = selection;

      if (!start) {
        setSelection([day, null]);
      } else if (!end) {
        setSelection(
          day.getTime() < start.getTime() ? [day, start] : [start, day],
        );
      } else {
        setSelection([day, null]);
      }
    },
    [allBookings, selection],
  );

  const selectedDates = useMemo(() => {
    const [start, end] = selection;
    if (!start) return [];
    const days: Date[] = [];
    const current = new Date(start);
    const last = end ?? start;
    while (current <= last) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  }, [selection]);

  const AdminDayContainer = useCallback(
    ({
      date,
      state,
      children,
      innerProps,
      getClassNames,
    }: DayContainerProps) => {
      const { className = "", ...restInner } = innerProps ?? {};
      const attributes = {
        ...(state.isSelected || state.isSelectedStart || state.isSelectedEnd
          ? { "data-selected": true }
          : {}),
        ...(state.isSelectedStart ? { "data-selected-start": true } : {}),
        ...(state.isSelectedEnd ? { "data-selected-end": true } : {}),
        ...(state.isReserved ? { "data-reserved": true } : {}),
        ...(state.isPast ? { "data-past": true } : {}),
        ...(state.isToday ? { "data-today": true } : {}),
        ...(state.isStartMonth ? { "data-start-month": true } : {}),
        ...(state.isEndMonth ? { "data-end-month": true } : {}),
      };
      return (
        <div
          aria-label={date.toDateString()}
          role="option"
          tabIndex={-1}
          className={getClassNames("DayContainer", className)}
          {...attributes}
          {...restInner}
          onClick={() => handleDayClick(date)}
        >
          {children}
        </div>
      );
    },
    [handleDayClick],
  );

  const AdminDayContent = useCallback(
    (props: DayContentProps) => {
      const { date, state, children, ...rest } = props;
      const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayBookings = bookingsInView.filter(
        (b) => b.start_date <= day && b.end_date >= day,
      );
      return (
        <BookingDayContent
          date={date}
          state={state}
          defaultPrice={defaultPrice}
          dayPrices={dayPrices}
          {...rest}
        >
          {children}
          {state.isSameMonth && dayBookings.length > 0 && (
            <div className="admin-cal-bookings">
              {dayBookings.map((b) => {
                const c = colorMap[b.id];
                return (
                  <div
                    key={b.id}
                    className="admin-cal-booking-bar"
                    style={{ backgroundColor: c.bar, color: "#fff" }}
                    title={t(
                      "client_nameStart_dateEnd_date",
                      "{{client_name}}: {{start_date}} → {{end_date}}",
                      {
                        client_name: b.client_name,
                        start_date: b.start_date,
                        end_date: b.end_date,
                      },
                    )}
                  >
                    <span className="admin-cal-booking-name">
                      {b.client_name}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </BookingDayContent>
      );
    },
    [bookingsInView, colorMap, t, dayPrices, defaultPrice],
  );

  if (loading) return Loader();

  return (
    <div className="admin-tab-content">
      <div className="admin-calendar">
        <div className="avail-controls">
          <div className="avail-select-group" style={{ margin: "0 auto" }}>
            <select
              value={viewYear}
              onChange={(e) => setViewYear(parseInt(e.target.value))}
              className="avail-select"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <select
              value={viewMonth}
              onChange={(e) =>
                setViewMonth(parseInt(e.target.value) as CalendarMonth)
              }
              className="avail-select"
            >
              {monthNames.map((m, i) => {
                return (
                  <option
                    key={i}
                    value={i}
                    disabled={viewYear === currYear && i < currMonth}
                  >
                    {m}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <Calendar
          className="admin-booking-calendar"
          selected={[selection[0] ?? null, selection[1] ?? null]}
          reserved={reserved}
          onChange={() => {}}
          month={viewMonth as CalendarMonth}
          year={viewYear}
          onMonthChange={(m, y) => {
            setViewMonth(m);
            setViewYear(y);
          }}
          options={{ weekStartsOn: 1, useAttributes: true }}
          components={{
            DayContent: AdminDayContent,
            DayContainer: AdminDayContainer,
          }}
        />

        {selection[0] && (
          <div className="admin-cal-selection">
            <div className="admin-cal-selection-info">
              <strong>{t("selected", "Selected")}:</strong>{" "}
              {formatDate(selection[0])}
              {selection[1] && (
                <>
                  {" — "}
                  {formatDate(selection[1])}
                </>
              )}
              {selectedDates.length > 1 && (
                <span className="admin-cal-selection-count">
                  {" "}
                  (
                  {t("daysCount", "{{count}} days", {
                    count: selectedDates.length,
                  })}
                  )
                </span>
              )}
            </div>
            <div className="admin-cal-selection-actions">
              <button
                className="admin-btn admin-btn-accept"
                onClick={() => setAdding(true)}
              >
                {t("addBooking", "Add Booking")}
              </button>
              <button
                className="admin-btn admin-btn-outline"
                onClick={() => setPriceEditing(true)}
              >
                {t("editPrices", "Edit Prices")}
              </button>
              <button
                className="admin-btn admin-btn-outline"
                onClick={() => setSelection([null, null])}
              >
                &times;
              </button>
            </div>
          </div>
        )}

        {bookingsInView.length > 0 && (
          <div className="admin-calendar-legend">
            <h3>{t("bookingsThisMonth", "Bookings this month")}</h3>
            <div className="admin-booking-legend-list">
              {bookingsInView.map((b) => {
                const c = colorMap[b.id];
                return (
                  <div key={b.id} className="admin-legend-item">
                    <span
                      className="admin-legend-dot"
                      style={{ backgroundColor: c.dot }}
                    />
                    <span className="admin-legend-name">{b.client_name}</span>
                    <span className="admin-legend-dates">
                      {formatDate(b.start_date as Date)} —{" "}
                      {formatDate(b.end_date as Date)}
                    </span>
                    <button
                      className="admin-legend-edit"
                      onClick={() => setEditing(b)}
                      aria-label={t("editBooking2", "Edit booking")}
                    >
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {editing && (
        <EditBookingModal
          booking={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            loadBookings();
          }}
          onDeleted={() => {
            setEditing(null);
            loadBookings();
          }}
        />
      )}

      {adding && selection[0] && (
        <AddBookingModal
          start={selection[0]}
          end={selection[1] ?? selection[0]}
          onClose={() => setAdding(false)}
          onSaved={() => {
            setAdding(false);
            setSelection([null, null]);
            loadBookings();
          }}
        />
      )}

      {priceEditing && selectedDates.length > 0 && (
        <PriceModal
          dates={selectedDates}
          dayPrices={dayPrices}
          defaultPrice={defaultPrice}
          onClose={() => setPriceEditing(false)}
          onSaved={() => {
            setPriceEditing(false);
            setSelection([null, null]);
            loadPrices();
          }}
        />
      )}
    </div>
  );
}
