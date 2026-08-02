import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Calendar,
  type CalendarDayState,
  type CalendarMonth,
  type DayContainerProps,
} from "@demark-pro/react-booking-calendar";
import "@demark-pro/react-booking-calendar/dist/react-booking-calendar.css";
import bookings from "../data/bookings";
import { useTranslation } from "react-i18next";
import { clearTime } from "../pages/admin/utils";

function formatShort(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface BookedRange {
  start: Date;
  end: Date;
}

interface CalendarModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (checkIn: Date | null, checkOut: Date | null) => void;
  initialCheckIn: Date | null;
  initialCheckOut: Date | null;
  bookedRanges: BookedRange[];
  previouslySelected?: [Date | null, Date | null];
}

function CalendarModal({
  open,
  onClose,
  onConfirm,
  initialCheckIn,
  initialCheckOut,
  bookedRanges,
  previouslySelected,
}: CalendarModalProps) {
  const { t } = useTranslation();
  const today = useMemo(() => clearTime(new Date()), []);

  const [viewMonth, setViewMonth] = useState<CalendarMonth>(
    (initialCheckIn ?? new Date()).getMonth() as CalendarMonth,
  );
  const [viewYear, setViewYear] = useState(
    (initialCheckIn ?? new Date()).getFullYear(),
  );
  const [checkIn, setCheckIn] = useState<Date | null>(initialCheckIn);
  const [checkOut, setCheckOut] = useState<Date | null>(initialCheckOut);

  useEffect(() => {
    if (!open) return;
    setCheckIn(initialCheckIn);
    setCheckOut(initialCheckOut);
    const base = initialCheckIn ?? new Date();
    setViewMonth(base.getMonth() as CalendarMonth);
    setViewYear(base.getFullYear());
  }, [open, initialCheckIn, initialCheckOut]);

  const isPreviouslySelected = useCallback(
    (date: Date) => {
      const d = clearTime(new Date(date));
      if (!previouslySelected?.[0] || !previouslySelected?.[1]) return false;
      return d >= clearTime(previouslySelected[0]) && d <= clearTime(previouslySelected[1]);
    },
    [previouslySelected],
  );

  const isBooked = useCallback(
    (date: Date) => {
      const d = clearTime(new Date(date));
      return bookedRanges.some(
        (b) => d >= clearTime(new Date(b.start)) && d <= clearTime(new Date(b.end)),
      );
    },
    [bookedRanges],
  );

  const disabled = useCallback(
    (date: Date, state: CalendarDayState) => {
      if (!state.isSameMonth) return true;
      if (isPreviouslySelected(date)) return false;
      const d = clearTime(new Date(date));
      if (d < today) return true;
      return isBooked(d);
    },
    [today, isBooked, isPreviouslySelected],
  );

  const reserved = useMemo(() => {
    const [ps, pe] = previouslySelected ?? [null, null];
    return bookedRanges
      .filter((b) => {
        if (!ps || !pe) return true;
        const start = clearTime(new Date(b.start));
        const end = clearTime(new Date(b.end));
        return !(start <= clearTime(pe) && end >= clearTime(ps));
      })
      .map((b) => ({ startDate: b.start, endDate: b.end, color: "#ffffff" }));
  }, [bookedRanges, previouslySelected]);

  const handleDayClick = useCallback(
    (date: Date, state: CalendarDayState) => {
      if (state.isDisabled) return;
      const d = clearTime(new Date(date));

      if (!checkIn || (checkIn && checkOut)) {
        setCheckIn(d);
        setCheckOut(null);
      } else if (d <= checkIn) {
        setCheckIn(d);
      } else {
        setCheckOut(d);
      }
    },
    [checkIn, checkOut],
  );

  const DayContainer = useCallback(
    ({ date, state, children, innerProps, getClassNames }: DayContainerProps) => {
      const { className = "", ...restInner } = innerProps ?? {};
      const attributes = {
        ...(state.isSelected || state.isSelectedStart || state.isSelectedEnd
          ? { "data-selected": true }
          : {}),
        ...(state.isSelectedStart ? { "data-selected-start": true } : {}),
        ...(state.isSelectedEnd ? { "data-selected-end": true } : {}),
        ...(state.isDisabled ? { "data-disabled": true } : {}),
        ...(state.isReserved ? { "data-reserved": true } : {}),
        ...(isPreviouslySelected(date) ? { "data-previously-selected": true } : {}),
      };
      return (
        <div
          className={getClassNames("DayContainer", className)}
          {...attributes}
          {...restInner}
          onClick={(e) => {
            e.stopPropagation();
            handleDayClick(date, state);
          }}
        >
          {children}
        </div>
      );
    },
    [handleDayClick, isPreviouslySelected],
  );

  const handleConfirm = () => {
    onConfirm(checkIn, checkOut);
    onClose();
  };

  const selecting: "checkin" | "checkout" = checkIn && !checkOut ? "checkout" : "checkin";

  if (!open) return null;

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

        <div className="cdp-calendar">
          <Calendar
            className="cdp-booking-calendar"
            selected={[checkIn ?? null, checkOut ?? null]}
            reserved={reserved}
            disabled={disabled}
            onChange={() => {}}
            month={viewMonth}
            year={viewYear}
            onMonthChange={(m, y) => {
              setViewMonth(m);
              setViewYear(y);
            }}
            options={{ weekStartsOn: 1, useAttributes: true }}
            components={{ DayContainer }}
          />
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
  const [bookedRanges, setBookedRanges] = useState<BookedRange[]>([]);

  useEffect(() => {
    bookings.getBookedDates().then(({ data }) => {
      setBookedRanges(data ?? []);
    });
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
        bookedRanges={bookedRanges}
        previouslySelected={prevoiuslySelected}
      />
    </>
  );
}
