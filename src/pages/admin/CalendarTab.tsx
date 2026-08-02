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
import { formatDate } from "./utils";
import EditBookingModal from "./EditBookingModal";
import type { Booking } from "../../data/types";
import { useTranslation } from "react-i18next";
import Loader from "../../components/Loader";
import BookingDayContent from "../../components/BookingDayContent";

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

export default function CalendarTab() {
  const { t } = useTranslation();
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const now = new Date();
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [editing, setEditing] = useState<Booking | null>(null);

  const loadBookings = useCallback(() => {
    bookings.list().then(({ data }) => {
      setAllBookings(data || []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

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

  const openDay = useCallback(
    (date: Date) => {
      const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const found = allBookings.find(
        (b) => b.start_date <= day && b.end_date >= day,
      );
      if (found) setEditing(found);
    },
    [allBookings],
  );

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
        ...((state.isSelected || state.isSelectedStart || state.isSelectedEnd)
          ? { "data-selected": true }
          : {}),
        ...(state.isReserved ? { "data-reserved": true } : {}),
        ...(state.isPast ? { "data-past": true } : {}),
        ...(state.isStartMonth ? { "data-start-month": true } : {}),
        ...(state.isEndMonth ? { "data-end-month": true } : {}),
      };
      return (
        <div
          aria-label={date.toDateString()}
          role="option"
          tabIndex={-1}
          className={getClassNames("DayContainer", className)}
          onClick={() => openDay(date)}
          {...attributes}
          {...restInner}
        >
          {children}
        </div>
      );
    },
    [openDay],
  );

  const AdminDayContent = useCallback(
    (props: DayContentProps) => {
      const { date, state, children, ...rest } = props;
      const day = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      );
      const dayBookings = bookingsInView.filter(
        (b) => b.start_date <= day && b.end_date >= day,
      );
      return (
        <BookingDayContent date={date} state={state} {...rest}>
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
    [bookingsInView, colorMap, t],
  );

  if (loading) return Loader();

  return (
    <div className="admin-tab-content">
      <div className="admin-calendar">
        <Calendar
          className="admin-booking-calendar"
          selected={[]}
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
    </div>
  );
}
