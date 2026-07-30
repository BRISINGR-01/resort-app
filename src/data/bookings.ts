import supabase from "./supabase";
import mockBookings from "./mockBookings";
import buildAvailability from "./buildAvailability";
import type {
  Booking,
  BookingPayload,
  SupabaseResponse,
  AvailabilityMonth,
} from "./types";
import { clearTime } from "../pages/admin/utils";

const TABLE = "design-studio-green-life-bookings";

const realBookings = {
  async list(): Promise<SupabaseResponse<Booking[]>> {
    return supabase
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false });
  },

  async get(id: string): Promise<SupabaseResponse<Booking>> {
    return supabase.from(TABLE).select("*").eq("id", id).single();
  },

  async create({
    client_name,
    start_date,
    end_date,
    guests_amount,
    note = null,
  }: BookingPayload): Promise<SupabaseResponse<Booking>> {
    clearTime(start_date);
    clearTime(end_date);
    return supabase
      .from(TABLE)
      .insert({ client_name, start_date, end_date, guests_amount, note })
      .select()
      .single();
  },

  async update(
    id: string,
    patch: Partial<BookingPayload>,
  ): Promise<SupabaseResponse<Booking>> {
    return supabase.from(TABLE).update(patch).eq("id", id).select().single();
  },

  async remove(id: string): Promise<SupabaseResponse<Booking>> {
    return supabase.from(TABLE).delete().eq("id", id).select().single();
  },

  async query(
    filters: Record<string, unknown>,
  ): Promise<SupabaseResponse<Booking[]>> {
    let builder = supabase.from(TABLE).select("*");
    for (const [key, value] of Object.entries(filters)) {
      builder = builder.eq(key, value);
    }
    return builder;
  },

  async getBookedDates(): Promise<{ start: Date; end: Date }[]> {
    const { data } = await supabase.from(TABLE).select("start_date, end_date");
    if (!data) return [];

    const today = new Date();
    return data
      .filter((d) => d.end_date > today)
      .map((d) => ({
        start: d.start_date,
        end: d.end_date,
      }));
  },
};

const bookings = import.meta.env.DEV ? mockBookings : realBookings;

export default bookings;
