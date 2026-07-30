import { type AvailabilityMonth, type Status } from "./types.ts";

interface DateRange {
  start_date: string | Date;
  end_date: string | Date;
}

export default function buildAvailability(
  bookings: DateRange[],
): AvailabilityMonth[] {
  const months: AvailabilityMonth[] = [];
  const start = new Date(2026, 6, 1);

  for (let i = 0; i < 12; i++) {
    const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
    const year = d.getFullYear();
    const monthNum = d.getMonth();
    const totalDays = new Date(year, monthNum + 1, 0).getDate();

    const days: Status[] = Array.from({ length: totalDays }, (_, day) => {
      const d = new Date(year, monthNum, day + 1);
      const booked = bookings.some((b) => b.start_date <= d && b.end_date >= d);
      return booked ? "booked" : "available";
    });

    months.push({
      month: monthNum,
      year,
      days,
    });
  }

  return months;
}
