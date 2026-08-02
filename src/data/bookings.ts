import supabase from "./supabase";
import mockBookings from "./mockBookings";
import type { Booking, BookingPayload, SupabaseResponse } from "./types";
import { clearTime, formatDate } from "../pages/admin/utils";

const TABLE = "design-studio-green-life-bookings";

interface Bookings {
  list(): Promise<SupabaseResponse<Booking[]>>;
  create({
    client_name,
    start_date,
    end_date,
    guests_amount,
    note,
  }: BookingPayload): Promise<SupabaseResponse<Booking>>;
  update(
    id: string,
    patch: Partial<BookingPayload>,
  ): Promise<SupabaseResponse<Booking>>;
  remove(id: string): Promise<SupabaseResponse<Booking>>;
  getBookedDates(): Promise<
    SupabaseResponse<{ start_date: Date; end_date: Date }[]>
  >;
}

const realBookings = {
  async list(): Promise<SupabaseResponse<Booking[]>> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .gte("end_date", formatDate(clearTime(new Date())))

      .order("created_at", { ascending: false });

    if (error || !data) return { data, error };

    return {
      error: null,
      data: data.map<Booking>((d) => ({
        ...d,
        end_date: clearTime(new Date(d.end_date)),
        start_date: clearTime(new Date(d.start_date)),
      })),
    };
  },

  async create({
    client_name,
    start_date,
    end_date,
    guests_amount,
    note = null,
  }: BookingPayload): Promise<SupabaseResponse<Booking>> {
    return supabase
      .from(TABLE)
      .insert({
        client_name,
        start_date: formatDate(clearTime(start_date)),
        end_date: formatDate(clearTime(end_date)),
        guests_amount,
        note,
      })
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

  async getBookedDates(): Promise<
    SupabaseResponse<{ start_date: Date; end_date: Date }[]>
  > {
    const { data, error } = await supabase
      .from(TABLE)
      .select("start_date, end_date")
      .gte("end_date", formatDate(clearTime(new Date())));

    if (error || !data) return { data, error };

    return {
      error: null,
      data: data.map((d) => ({
        start_date: clearTime(new Date(d.start_date)),
        end_date: clearTime(new Date(d.end_date)),
      })),
    };
  },
};

const bookings: Bookings = import.meta.env.DEV ? mockBookings : realBookings;

export default bookings;
