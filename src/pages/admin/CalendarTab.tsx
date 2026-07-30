import { useState, useEffect, useMemo, useCallback } from "react";
import bookings from "../../data/bookings";
import { formatDate, useDayLabels, useMonthNames } from "./utils";
import CalendarGrid from "../../components/CalendarGrid";
import EditBookingModal from "./EditBookingModal";
import type { Booking } from "../../data/types";
import { useTranslation } from "react-i18next";

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
  const monthNames = useMonthNames();
  const dayLabels = useDayLabels();

  const loadBookings = useCallback(() => {
    bookings.list().then(({ data }) => {
      setAllBookings(data || []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const bookingsInView = allBookings.filter((b) => {
    const monthStart = new Date(viewYear, viewMonth, 1);
    const monthEnd = new Date(viewYear, viewMonth, daysInMonth);
    return b.start_date <= monthEnd && b.end_date >= monthStart;
  });

  const colorMap = useMemo(() => {
    const map: Record<string, VisitorColor> = {};
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
        <CalendarGrid
          year={viewYear}
          month={viewMonth}
          dayLabels={dayLabels}
          weekStart="mon"
          showNav
          title={t("valViewyear", "{{val}} {{viewYear}}", {
            val: monthNames[viewMonth],
            viewYear,
          })}
          onPrev={prevMonth}
          onNext={nextMonth}
          renderDay={(day) => {
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
                className={`admin-cal-cell ${isToday ? "admin-cal-today" : ""} ${isBooked ? "admin-cal-booked" : ""}`}
                style={primary ? { backgroundColor: primary.bg } : undefined}
                onClick={
                  isBooked ? () => setEditing(bookingsOnDay[0]) : undefined
                }
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
              </div>
            );
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
