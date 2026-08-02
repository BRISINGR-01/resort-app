import { clearTime } from "../pages/admin/utils";
import type { Booking, BookingPayload, SupabaseResponse } from "./types";
import i18next from "i18next";

let bookings: Booking[] = [
  {
    id: "b1e8f1a0-1234-4a5b-8c9d-0e1f2a3b4c5d",
    created_at: "2026-07-01T10:00:00Z",
    client_name: "Ivan Petrov",
    start_date: new Date("2026-07-28"),
    end_date: new Date("2026-07-30"),
    phone: "+3597589834",
    email: "i@petrov.com",
    guests_amount: 2,
    note: i18next.t("earlyCheckinIfPossible", "Early check-in if possible"),
  },
  {
    id: "c2f9a2b1-2345-4b6c-9d0e-1f2a3b4c5d6e",
    created_at: "2026-07-03T14:30:00Z",
    client_name: "Maria Georgieva",
    start_date: new Date("2026-08-01"),
    end_date: new Date("2026-08-07"),
    guests_amount: 3,
    note: null,
  },
  {
    id: "d3a0b3c2-3456-4c7d-0e1f-2a3b4c5d6e7f",
    created_at: "2026-07-10T09:15:00Z",
    client_name: "Georgi Dimitrov",
    start_date: new Date("2026-08-10"),
    end_date: new Date("2026-08-14"),
    guests_amount: 1,
    note: i18next.t("quietRoomPreferred", "Quiet room preferred"),
  },
];

bookings.forEach((b) => {
  clearTime(b.start_date);
  clearTime(b.end_date);
});

function uid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

const mockBookings = {
  async list(): Promise<SupabaseResponse<Booking[]>> {
    return { data: [...bookings], error: null };
  },

  async get(id: string): Promise<SupabaseResponse<Booking>> {
    const row = bookings.find((b) => b.id === id);
    return {
      data: row ? { ...row } : null,
      error: row ? null : { message: i18next.t("notFound", "Not found") },
    };
  },

  async create({
    client_name,
    start_date,
    end_date,
    guests_amount,
    note = null,
  }: BookingPayload): Promise<SupabaseResponse<Booking>> {
    const row: Booking = {
      id: uid(),
      created_at: new Date().toISOString(),
      client_name,
      start_date: clearTime(start_date),
      end_date: clearTime(end_date),
      guests_amount,
      note,
    };
    bookings.push(row);
    return { data: { ...row }, error: null };
  },

  async update(
    id: string,
    patch: Partial<BookingPayload>,
  ): Promise<SupabaseResponse<Booking>> {
    const idx = bookings.findIndex((b) => b.id === id);
    if (idx === -1)
      return {
        data: null,
        error: { message: i18next.t("notFound", "Not found") },
      };
    bookings[idx] = { ...bookings[idx], ...patch };

    return { data: { ...bookings[idx] }, error: null };
  },

  async remove(id: string): Promise<SupabaseResponse<Booking>> {
    const idx = bookings.findIndex((b) => b.id === id);
    if (idx === -1)
      return {
        data: null,
        error: { message: i18next.t("notFound", "Not found") },
      };
    const [deleted] = bookings.splice(idx, 1);
    return { data: { ...deleted }, error: null };
  },

  async query(
    filters: Record<string, unknown>,
  ): Promise<SupabaseResponse<Booking[]>> {
    let rows = [...bookings];
    for (const [key, value] of Object.entries(filters)) {
      rows = rows.filter(
        (r) => (r as unknown as Record<string, unknown>)[key] === value,
      );
    }
    return { data: rows, error: null };
  },

  async getBookedDates(): Promise<
    SupabaseResponse<{ start: Date; end: Date }[]>
  > {
    const today = clearTime(new Date());

    return {
      error: null,
      data: bookings
        .filter((d) => d.end_date >= today)
        .map((d) => ({
          start: d.start_date,
          end: d.end_date,
        })),
    };
  },
};

export default mockBookings;
