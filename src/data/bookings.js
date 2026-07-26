import supabase from "./supabase";
import mockBookings from "./mockBookings";
import buildAvailability from "./buildAvailability";

const TABLE = "design-studio-green-life-bookings";
const USE_MOCK = process.env.REACT_APP_TABLE_BOOKINGS === "mock";

const realBookings = {
  async list() {
    return supabase.from(TABLE).select("*").order("created_at", { ascending: false });
  },

  async get(id) {
    return supabase.from(TABLE).select("*").eq("id", id).single();
  },

  async create({ client_name, start_date, end_date, guests_amount, note = null }) {
    return supabase
      .from(TABLE)
      .insert({ client_name, start_date, end_date, guests_amount, note })
      .select()
      .single();
  },

  async update(id, patch) {
    return supabase.from(TABLE).update(patch).eq("id", id).select().single();
  },

  async remove(id) {
    return supabase.from(TABLE).delete().eq("id", id).select().single();
  },

  async query(filters) {
    let builder = supabase.from(TABLE).select("*");
    for (const [key, value] of Object.entries(filters)) {
      builder = builder.eq(key, value);
    }
    return builder;
  },

  async availability() {
    const { data } = await supabase.from(TABLE).select("start_date, end_date");
    return buildAvailability(data || []);
  },
};

const bookings = USE_MOCK ? mockBookings : realBookings;

export default bookings;
