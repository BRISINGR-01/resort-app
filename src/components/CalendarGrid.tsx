import { useMemo } from "react";

export interface CalendarGridProps {
  year: number;
  month: number;
  dayLabels: string[];
  weekStart?: "sun" | "mon";
  showNav?: boolean;
  title?: string;
  onPrev?: () => void;
  onNext?: () => void;
  renderDay: (day: number) => React.ReactNode;
}

export default function CalendarGrid({
  year,
  month,
  dayLabels,
  weekStart = "sun",
  showNav = false,
  title,
  onPrev,
  onNext,
  renderDay,
}: CalendarGridProps) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const firstDayOffset = useMemo(() => {
    const dow = new Date(year, month, 1).getDay();
    return weekStart === "mon" ? (dow === 0 ? 6 : dow - 1) : dow;
  }, [year, month, weekStart]);

  const sortedLabels = useMemo(
    () =>
      weekStart === "mon" ? [...dayLabels.slice(1), dayLabels[0]] : dayLabels,
    [dayLabels, weekStart],
  );

  return (
    <>
      {showNav && (
        <div className="cg-nav">
          <button
            className="cg-nav-btn"
            onClick={onPrev}
            type="button"
            aria-label="Previous month"
          >
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
          <span className="cg-title">{title}</span>
          <button
            className="cg-nav-btn"
            onClick={onNext}
            type="button"
            aria-label="Next month"
          >
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
      )}

      <div className="cg-weekdays">
        {sortedLabels.map((d) => (
          <span key={d} className="cg-weekday">
            {d}
          </span>
        ))}
      </div>

      <div className="cg-grid">
        {Array.from({ length: firstDayOffset }, (_, i) => (
          <div key={`empty-${i}`} className="cg-cell cg-cell-empty" />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => (
          <div key={i + 1} className="cg-cell">
            {renderDay(i + 1)}
          </div>
        ))}
      </div>
    </>
  );
}
