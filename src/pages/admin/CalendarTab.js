import { useState, useEffect, useMemo, useCallback } from "react";
import bookings from "../../data/bookings";
import {
  MONTH_NAMES,
  DAY_LABELS,
  formatDate,
  dateKey,
  getDaysInMonth,
  getFirstDayOfMonth,
} from "./utils";
import EditBookingModal from "./EditBookingModal";

const VISITOR_COLORS = [
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
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const now = new Date();
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [editing, setEditing] = useState(null);

  const loadBookings = useCallback(() => {
    bookings.list().then(({ data }) => {
      setAllBookings(data || []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const bookingsInView = allBookings.filter((b) => {
    const monthStart = new Date(viewYear, viewMonth, 1);
    const monthEnd = new Date(viewYear, viewMonth, daysInMonth);
    return b.start_date <= monthEnd && b.end_date >= monthStart;
  });

  const colorMap = useMemo(() => {
    const map = {};
    bookingsInView.forEach((b, i) => {
      map[b.id] = VISITOR_COLORS[i % VISITOR_COLORS.length];
    });
    return map;
  }, [bookingsInView]);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  if (loading)
    return (
      <div className="admin-loader">
        <span className="btn-spinner" />
      </div>
    );

  return (
    <div className="admin-tab-content">
      <div className="admin-calendar">
        <div className="admin-calendar-nav">
          <button className="admin-btn admin-btn-nav" onClick={prevMonth}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="admin-calendar-title">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </h2>
          <button className="admin-btn admin-btn-nav" onClick={nextMonth}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="admin-calendar-weekdays">
          {DAY_LABELS.map((d) => (
            <span key={d} className="admin-cal-weekday">
              {d}
            </span>
          ))}
        </div>

        <div className="admin-calendar-grid">
          {Array.from({ length: firstDay }, (_, i) => (
            <div
              key={`empty-${i}`}
              className="admin-cal-cell admin-cal-empty"
            />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dayAsDate = new Date(viewYear, viewMonth, day);

            const bookingsOnDay = bookingsInView.filter(
              (b) => b.start_date <= dayAsDate && b.end_date >= dayAsDate,
            );
            const isToday =
              new Date().getDate() === day &&
              new Date().getMonth() === viewMonth &&
              new Date().getFullYear() === viewYear;
            const primary = bookingsOnDay[0]
              ? colorMap[bookingsOnDay[0].id]
              : null;

            const isBooked = bookingsOnDay.length > 0;

            return (
              <div
                key={day}
                className={`admin-cal-cell ${isToday ? "admin-cal-today" : ""} ${isBooked ? "admin-cal-booked" : ""}`}
                style={primary ? { backgroundColor: primary.bg } : undefined}
                onClick={isBooked ? () => setEditing(bookingsOnDay[0]) : null}
              >
                <span className="admin-cal-day-num">{day}</span>
                {isBooked && (
                  <div className="admin-cal-bookings">
                    {bookingsOnDay.map((b) => {
                      const c = colorMap[b.id];
                      return (
                        <div
                          key={b.id}
                          className="admin-cal-booking-bar"
                          style={{ backgroundColor: c.bar, color: "#fff" }}
                          title={`${b.client_name}: ${b.start_date} \u2192 ${b.end_date}`}
                        >
                          <span className="admin-cal-booking-name">
                            {b.client_name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {bookingsInView.length > 0 && (
          <div className="admin-calendar-legend">
            <h3>Bookings this month</h3>
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
                      {formatDate(b.start_date)} — {formatDate(b.end_date)}
                    </span>
                    <button
                      className="admin-legend-edit"
                      onClick={() => setEditing(b)}
                      aria-label="Edit booking"
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
