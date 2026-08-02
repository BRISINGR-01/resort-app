import type { DayContentProps } from "@demark-pro/react-booking-calendar";

export default function BookingDayContent({
  state,
  children,
  innerProps,
  getClassNames,
}: DayContentProps) {
  const { className = "", ...restInner } = innerProps ?? {};

  const attributes = {
    ...(state.isSelected || state.isSelectedStart || state.isSelectedEnd
      ? { "data-selected": true }
      : {}),
    ...(state.isReserved ? { "data-reserved": true } : {}),
    ...(state.isPast ? { "data-past": true } : {}),
    ...(state.isToday ? { "data-today": true } : {}),
  };

  const extraClass = state.isSameMonth ? "" : " neighbor-day-num";

  return (
    <div
      className={getClassNames("DayContent", `${className}${extraClass}`)}
      {...attributes}
      {...restInner}
    >
      {children}
    </div>
  );
}
