import supabase from "./supabase";
import mockRequests from "./mockRequests";
import mockBookings from "./mockBookings";
import { setBookingsRef } from "./mockRequests";

const TABLE = "design-studio-green-life-requests";
const BOOKINGS_TABLE = "design-studio-green-life-bookings";
const USE_MOCK = process.env.REACT_APP_TABLE_REQUESTS === "mock";

if (USE_MOCK) {
  setBookingsRef(mockBookings);
}

const realRequests = {
  async list() {
    return supabase
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false });
  },

  async getPending() {
    return supabase
      .from(TABLE)
      .select("*")
      .eq("denied", false)
      .order("created_at", { ascending: false });
  },

  async getRejected() {
    return supabase
      .from(TABLE)
      .select("*")
      .eq("denied", true)
      .order("created_at", { ascending: false });
  },

  async get(id) {
    return supabase.from(TABLE).select("*").eq("id", id).single();
  },

  async accept(id) {
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

  async reject(id) {
    return supabase
      .from(TABLE)
      .update({ denied: true })
      .eq("id", id)
      .select()
      .single();
  },
};

const requests = USE_MOCK ? mockRequests : realRequests;

export default requests;
