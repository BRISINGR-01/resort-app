import { clearTime } from "../pages/admin/utils";
import type {
  Request,
  RequestPayload,
  BookingPayload,
  SupabaseResponse,
} from "./types";
import i18next from "i18next";

let requests: Request[] = [
  {
    id: "r1a2b3c4-1111-4aaa-bbbb-111111111111",
    created_at: "2026-07-20T08:00:00Z",
    client_name: "Anna Sokolova",
    start_date: new Date("2026-08-15"),
    end_date: new Date("2026-08-20"),
    guests_amount: 2,
    note: "Anniversary trip",
    denied: false,
  },
  {
    id: "r2b3c4d5-2222-4bbb-cccc-222222222222",
    created_at: "2026-07-22T12:00:00Z",
    client_name: "Dimitar Vangelov",
    start_date: new Date("2026-09-01"),
    end_date: new Date("2026-09-05"),
    guests_amount: 3,
    note: null,
    denied: false,
  },
  {
    id: "r3c4d5e6-3333-4ccc-dddd-333333333333",
    created_at: "2026-07-24T16:45:00Z",
    client_name: "Elena Markova",
    start_date: new Date("2026-07-28"),
    end_date: new Date("2026-07-30"),
    guests_amount: 1,
    note: "Business trip",
    denied: false,
  },
];

requests.forEach((r) => {
  clearTime(r.start_date);
  clearTime(r.end_date);
});

let mockBookingsRef: {
  create: (booking: BookingPayload) => Promise<SupabaseResponse<unknown>>;
} | null = null;

function uid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function setBookingsRef(ref: {
  create: (booking: BookingPayload) => Promise<SupabaseResponse<unknown>>;
}): void {
  mockBookingsRef = ref;
}

const mockRequests = {
  async list(): Promise<SupabaseResponse<Request[]>> {
    return { data: [...requests], error: null };
  },

  async getPending(): Promise<SupabaseResponse<Request[]>> {
    return { data: requests.filter((r) => !r.denied), error: null };
  },

  async getRejected(): Promise<SupabaseResponse<Request[]>> {
    return { data: requests.filter((r) => r.denied), error: null };
  },

  async get(id: string): Promise<SupabaseResponse<Request>> {
    const row = requests.find((r) => r.id === id);
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
    phone = null,
    email = null,
  }: RequestPayload): Promise<SupabaseResponse<Request>> {
    const row: Request = {
      id: uid(),
      created_at: new Date().toISOString(),
      client_name,
      start_date,
      end_date,
      guests_amount,
      note,
      phone,
      email,
      denied: false,
    };
    clearTime(start_date);
    clearTime(end_date);
    requests.push(row);
    return { data: { ...row }, error: null };
  },

  async accept(id: string): Promise<SupabaseResponse<Request>> {
    const idx = requests.findIndex((r) => r.id === id);
    if (idx === -1)
      return {
        data: null,
        error: { message: i18next.t("notFound", "Not found") },
      };

    const request: Request = { ...requests[idx], denied: false };
    requests[idx] = request;

    if (mockBookingsRef) {
      const { id: _id, created_at: _c, denied: _d, ...bookingFields } = request;
      await mockBookingsRef.create({
        ...bookingFields,
        start_date: bookingFields.start_date,
        end_date: bookingFields.end_date,
      });
    }

    return { data: { ...request }, error: null };
  },

  async reject(id: string): Promise<SupabaseResponse<Request>> {
    const idx = requests.findIndex((r) => r.id === id);
    if (idx === -1)
      return {
        data: null,
        error: { message: i18next.t("notFound", "Not found") },
      };
    requests[idx] = { ...requests[idx], denied: true };
    return { data: { ...requests[idx] }, error: null };
  },
};

export { setBookingsRef };
export default mockRequests;
