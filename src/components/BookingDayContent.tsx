import type { DayContentProps } from "@demark-pro/react-booking-calendar";
import type { PricesData } from "../data/types";
import { clearTime } from "../pages/admin/utils";

interface BookingDayContentProps extends DayContentProps {
  dayPrices: PricesData[];
  defaultPrice: number;
}

export default function BookingDayContent({
  date,
  state,
  children,
  innerProps,
  getClassNames,
  dayPrices = [],
  defaultPrice,
}: BookingDayContentProps) {
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

  const price =
    dayPrices.find((p) => p.date.getTime() === clearTime(date).getTime())
      ?.price ?? defaultPrice;

  return (
    <div
      className={getClassNames("DayContent", `${className}${extraClass}`)}
      {...attributes}
      {...restInner}
    >
      {children}
      {state.isSameMonth && price != null && (
        <span className="day-price">{price} €</span>
      )}
    </div>
  );
}
