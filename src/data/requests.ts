import supabase from "./supabase";
import mockRequests from "./mockRequests";
import mockBookings from "./mockBookings";
import { setBookingsRef } from "./mockRequests";
import type { Request, RequestPayload, SupabaseResponse } from "./types";

interface Requests {
  list(): Promise<SupabaseResponse<Request[]>>;
  getPending(): Promise<SupabaseResponse<Request[]>>;
  getRejected(): Promise<SupabaseResponse<Request[]>>;
  get(id: string): Promise<SupabaseResponse<Request>>;
  create({
    client_name,
    start_date,
    end_date,
    guests_amount,
    note,
    phone,
    email,
  }: RequestPayload): Promise<SupabaseResponse<Request>>;
  accept(id: string): Promise<SupabaseResponse<Request>>;
  reject(id: string): Promise<SupabaseResponse<Request>>;
}

const TABLE = "design-studio-green-life-requests";
const BOOKINGS_TABLE = "design-studio-green-life-bookings";

if (import.meta.env.DEV) {
  setBookingsRef(mockBookings);
}

const requests: Requests = {
  async list(): Promise<SupabaseResponse<Request[]>> {
    return supabase
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false });
  },

  async getPending(): Promise<SupabaseResponse<Request[]>> {
    return supabase
      .from(TABLE)
      .select("*")
      .eq("denied", false)
      .order("created_at", { ascending: false });
  },

  async getRejected(): Promise<SupabaseResponse<Request[]>> {
    return supabase
      .from(TABLE)
      .select("*")
      .eq("denied", true)
      .order("created_at", { ascending: false });
  },

  async get(id: string): Promise<SupabaseResponse<Request>> {
    return supabase.from(TABLE).select("*").eq("id", id).single();
  },

  async create({
    client_name,
    start_date,
    end_date,
    guests_amount,
    note = null,
    phone = null,
    email = null,
  }: RequestPayload): Promise<SupabaseResponse<Request>> {
    return supabase
      .from(TABLE)
      .insert({
        client_name,
        start_date,
        end_date,
        guests_amount,
        note,
        phone,
        email,
        denied: false,
      })
      .select()
      .single();
  },

  async accept(id: string): Promise<SupabaseResponse<Request>> {
    const { data: request, error } = await supabase
      .from(TABLE)
      .update({ denied: false })
      .eq("id", id)
      .select()
      .single();

    if (error) return { data: null, error };

    const { denied: _d, created_at: _c, id: _id, ...bookingFields } = request;
    return supabase
      .from(BOOKINGS_TABLE)
      .insert(bookingFields)
      .select()
      .single();
  },

  async reject(id: string): Promise<SupabaseResponse<Request>> {
    return supabase
      .from(TABLE)
      .update({ denied: true })
      .eq("id", id)
      .select()
      .single();
  },
};

export default import.meta.env.DEV ? mockRequests : requests;
