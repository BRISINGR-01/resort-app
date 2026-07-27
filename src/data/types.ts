export interface Booking {
  id: string;
  created_at: string;
  client_name: string;
  start_date: string | Date;
  end_date: string | Date;
  phone?: string;
  email?: string;
  guests_amount: number;
  note?: string | null;
}

export interface Request {
  id: string;
  created_at: string;
  client_name: string;
  start_date: string | Date;
  end_date: string | Date;
  guests_amount: number;
  note?: string | null;
  phone?: string | null;
  email?: string | null;
  denied: boolean;
}

export interface BookingPayload {
  client_name: string;
  start_date: string;
  end_date: string;
  guests_amount: number;
  note?: string | null;
  phone?: string;
  email?: string | null;
}

export interface RequestPayload {
  client_name: string;
  start_date: string;
  end_date: string;
  guests_amount: number;
  note?: string | null;
  phone?: string | null;
  email?: string | null;
}

export interface SupabaseResponse<T> {
  data: T | null;
  error: { message: string } | null;
}

export interface AvailabilityMonth {
  month: string;
  status: "available" | "limited" | "booked";
  spots: number;
  days: ("available" | "booked")[];
}

export interface BookingFormData {
  client_name: string;
  phone: string;
  email: string;
  guests_amount: number;
  note: string;
  dates: string;
}
