let requests = [
  {
    id: "r1a2b3c4-1111-4aaa-bbbb-111111111111",
    created_at: "2026-07-20T08:00:00Z",
    client_name: "Anna Sokolova",
    start_date: "2026-08-15",
    end_date: "2026-08-20",
    guests_amount: 2,
    note: "Anniversary trip",
    denied: false,
  },
  {
    id: "r2b3c4d5-2222-4bbb-cccc-222222222222",
    created_at: "2026-07-22T12:00:00Z",
    client_name: "Dimitar Vangelov",
    start_date: "2026-09-01",
    end_date: "2026-09-05",
    guests_amount: 3,
    note: null,
    denied: false,
  },
  {
    id: "r3c4d5e6-3333-4ccc-dddd-333333333333",
    created_at: "2026-07-24T16:45:00Z",
    client_name: "Elena Markova",
    start_date: "2026-07-28",
    end_date: "2026-07-30",
    guests_amount: 1,
    note: "Business trip",
    denied: false,
  },
];

let mockBookingsRef = null;

function uid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function setBookingsRef(ref) {
  mockBookingsRef = ref;
}

const mockRequests = {
  async list() {
    return { data: [...requests], error: null };
  },

  async get(id) {
    const row = requests.find((r) => r.id === id);
    return { data: row ? { ...row } : null, error: row ? null : { message: "Not found" } };
  },

  async accept(id) {
    const idx = requests.findIndex((r) => r.id === id);
    if (idx === -1) return { data: null, error: { message: "Not found" } };

    const request = { ...requests[idx], denied: false };
    requests[idx] = request;

    if (mockBookingsRef) {
      const { id: _id, created_at: _c, denied: _d, ...bookingFields } = request;
      await mockBookingsRef.create(bookingFields);
    }

    return { data: { ...request }, error: null };
  },

  async reject(id) {
    const idx = requests.findIndex((r) => r.id === id);
    if (idx === -1) return { data: null, error: { message: "Not found" } };
    requests[idx] = { ...requests[idx], denied: true };
    return { data: { ...requests[idx] }, error: null };
  },
};

export { setBookingsRef };
export default mockRequests;
