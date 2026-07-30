import { useState, useEffect } from "react";
import bookings from "../data/bookings";
import type { Status } from "../data/types";
import { useTranslation } from "react-i18next";
import { useMonthNames } from "../pages/admin/utils";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface AvailabilityEntry {
  month: string;
  days: Status[];
}

function buildDateMap(
  availability: AvailabilityEntry[],
  monthNames: string[],
  prevoiuslySelected?: [Date | null, Date | null],
): Record<string, Status> {
  const map: Record<string, Status> = {};
  for (const entry of availability) {
    const [monthName, yearStr] = entry.month.split(" ");
    const monthNum = monthNames.indexOf(monthName);
    const year = parseInt(yearStr);
    entry.days.forEach((status, i) => {
      const d = new Date(year, monthNum, i + 1);

      if (
        prevoiuslySelected &&
        prevoiuslySelected[0] &&
        prevoiuslySelected[1] &&
        d >= prevoiuslySelected[0] &&
        d <= prevoiuslySelected[1]
      ) {
        status = "previously-selected";
      }

      const key = d.toISOString().slice(0, 10);
      map[key] = status;
    });
  }

  return map;
}

function dateToKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function formatShort(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getMonthMeta(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  return { firstDay, totalDays };
}

interface CalendarModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (checkIn: Date | null, checkOut: Date | null) => void;
  initialCheckIn: Date | null;
  initialCheckOut: Date | null;
  dateMap: Record<string, Status>;
}

function CalendarModal({
  open,
  onClose,
  onConfirm,
  initialCheckIn,
  initialCheckOut,
  dateMap,
}: CalendarModalProps) {
  const { t } = useTranslation();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [checkIn, setCheckIn] = useState<Date | null>(initialCheckIn);
  const [checkOut, setCheckOut] = useState<Date | null>(initialCheckOut);
  const [selecting, setSelecting] = useState<"checkin" | "checkout">("checkin");
  const monthNames = useMonthNames();

  useEffect(() => {
    if (open) {
      setCheckIn(initialCheckIn);
      setCheckOut(initialCheckOut);
      setSelecting("checkin");
      if (initialCheckIn) {
        setViewMonth(initialCheckIn.getMonth());
        setViewYear(initialCheckIn.getFullYear());
      } else {
        const now = new Date();
        setViewMonth(now.getMonth());
        setViewYear(now.getFullYear());
      }
    }
  }, [open, initialCheckIn, initialCheckOut]);

  const goToPrev = () => {
    setViewMonth((m) => {
      if (m === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  };

  const goToNext = () => {
    setViewMonth((m) => {
      if (m === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  };

  const handleDayClick = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    date.setHours(0, 0, 0, 0);
    const key = dateToKey(date);
    if (date < today) return;
    if (dateMap[key] === "booked") return;

    if (selecting === "checkin") {
      setCheckIn(date);
      setCheckOut(null);
      setSelecting("checkout");
    } else {
      if (date <= checkIn!) {
        setCheckIn(date);
        setCheckOut(null);
        setSelecting("checkout");
      } else {
        setCheckOut(date);
        setSelecting("checkin");
      }
    }
  };

  const handleConfirm = () => {
    onConfirm(checkIn, checkOut);
    onClose();
  };

  const isPast = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0, 0, 0, 0);
    return d < today;
  };

  const isBooked = (day: number) => {
    const key = dateToKey(new Date(viewYear, viewMonth, day));
    return !!(key && dateMap[key] === "booked");
  };

  const isSelected = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0, 0, 0, 0);
    if (checkIn && d.getTime() === checkIn.getTime()) return true;
    if (checkOut && d.getTime() === checkOut.getTime()) return true;
    return false;
  };

  const isInRange = (day: number) => {
    if (!checkIn || !checkOut) return false;
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0, 0, 0, 0);
    return d > checkIn && d < checkOut;
  };

  const wasSelected = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    return dateMap[dateToKey(d)] === "previously-selected";
  };

  if (!open) return null;

  const { firstDay, totalDays } = getMonthMeta(viewYear, viewMonth);

  return (
    <div className="cdp-overlay" onClick={onClose}>
      <div className="cdp-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cdp-modal-header">
          <h3>{t("selectDates", "Select Dates")}</h3>
          <button
            className="cdp-close"
            onClick={onClose}
            aria-label={t("close", "Close")}
          >
            &times;
          </button>
        </div>

        <div className="cdp-selection-row">
          <div
            className={`cdp-selection-chip ${selecting === "checkin" ? "cdp-active" : ""}`}
          >
            <span className="cdp-chip-label">{t("checkin", "Check-in")}</span>
            <span className="cdp-chip-value">
              {checkIn ? formatShort(checkIn) : "\u2014"}
            </span>
          </div>
          <span className="cdp-arrow">{"\u2192"}</span>
          <div
            className={`cdp-selection-chip ${selecting === "checkout" ? "cdp-active" : ""}`}
          >
            <span className="cdp-chip-label">{t("checkout", "Check-out")}</span>
            <span className="cdp-chip-value">
              {checkOut ? formatShort(checkOut) : "\u2014"}
            </span>
          </div>
        </div>

        <div className="cdp-nav">
          <button
            className="cdp-nav-btn"
            onClick={goToPrev}
            type="button"
            aria-label="Previous month"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span className="cdp-month-title">
            {monthNames[viewMonth]} {viewYear}
          </span>
          <button
            className="cdp-nav-btn"
            onClick={goToNext}
            aria-label="Next month"
            type="button"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <div className="cdp-weekdays">
          {DAY_LABELS.map((d) => (
            <span key={d} className="cdp-weekday">
              {d}
            </span>
          ))}
        </div>

        <div className="cdp-days">
          {Array.from({ length: firstDay }, (_, i) => (
            <span key={`empty-${i}`} className="cdp-day cdp-day-empty" />
          ))}
          {Array.from({ length: totalDays }, (_, i) => {
            const day = i + 1;
            const past = isPast(day);
            const selected = isSelected(day);
            const inRange = isInRange(day);
            const previouslySelected = wasSelected(day);
            const booked = isBooked(day) && !previouslySelected;
            const disabled = (past || booked) && !previouslySelected;

            let cls = "cdp-day";
            if (disabled) cls += " cdp-day-disabled";
            if (selected) cls += " cdp-day-selected";
            if (inRange) cls += " cdp-day-in-range";
            if (previouslySelected) cls += " cdp-day-previously-selected";

            return (
              <button
                key={day}
                className={cls}
                onClick={() => !disabled && handleDayClick(day)}
                disabled={disabled}
                type="button"
              >
                {day}
              </button>
            );
          })}
        </div>

        <div className="cdp-actions">
          <button
            className="cdp-btn cdp-btn-primary"
            onClick={handleConfirm}
            disabled={!checkIn}
          >
            {t("done", "Done")}
          </button>
        </div>
      </div>
    </div>
  );
}

interface DatePickerProps {
  defaultVal: (Date | null)[];
  onDateChange: (checkIn: Date | null, checkOut: Date | null) => void;
  prevoiuslySelected?: [Date | null, Date | null];
}

export default function DatePicker({
  defaultVal,
  prevoiuslySelected,
  onDateChange,
}: DatePickerProps) {
  const { t } = useTranslation();
  const [checkIn, setCheckIn] = useState<Date | null>(defaultVal[0] ?? null);
  const [checkOut, setCheckOut] = useState<Date | null>(defaultVal[1] ?? null);
  const [open, setOpen] = useState(false);
  const [dateMap, setDateMap] = useState<Record<string, Status>>({});
  const monthNames = useMonthNames();

  useEffect(() => {
    bookings
      .availability(monthNames)
      .then((avail: AvailabilityEntry[]) =>
        setDateMap(buildDateMap(avail, monthNames, prevoiuslySelected)),
      );
  }, []);

  const handleConfirm = (ci: Date | null, co: Date | null) => {
    setCheckIn(ci);
    setCheckOut(co);
    onDateChange?.(ci, co);
  };

  const clearDates = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCheckIn(null);
    setCheckOut(null);
    onDateChange?.(null, null);
  };

  const displayText = checkIn
    ? checkOut
      ? t("valVal2", "{{val}} - {{val2}}", {
          val: formatShort(checkIn),
          val2: formatShort(checkOut),
        })
      : t("valSelectCheckout", "{{val}} - Select checkout", {
          val: formatShort(checkIn),
        })
    : t("selectCheckinDate", "Select check-in date");

  return (
    <>
      <div className="rdp-wrapper" onClick={() => setOpen(true)}>
        <div className="rdp-display">
          <svg
            className="rdp-display-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span
            className={`rdp-display-text ${!checkIn ? "rdp-placeholder" : ""}`}
          >
            {displayText}
          </span>
          {checkIn && (
            <button
              className="rdp-clear"
              onClick={clearDates}
              aria-label="Clear dates"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      <CalendarModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
        initialCheckIn={checkIn}
        initialCheckOut={checkOut}
        dateMap={dateMap}
      />
    </>
  );
}
