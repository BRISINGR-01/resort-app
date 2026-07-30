export interface Booking {
  id: string;
  created_at: string;
  client_name: string;
  start_date: Date;
  end_date: Date;
  phone?: string | null;
  email?: string | null;
  guests_amount: number;
  note?: string | null;
}

export interface Request {
  id: string;
  created_at: string;
  client_name: string;
  start_date: Date;
  end_date: Date;
  guests_amount: number;
  note?: string | null;
  phone?: string | null;
  email?: string | null;
  denied: boolean;
}

export interface BookingPayload {
  client_name: string;
  start_date: Date;
  end_date: Date;
  guests_amount: number;
  note?: string | null;
  phone?: string | null;
  email?: string | null;
}

export interface RequestPayload {
  client_name: string;
  start_date: Date;
  end_date: Date;
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
  month: number;
  year: number;
  days: Status[];
}

export type Status = "available" | "booked" | "previously-selected";

export interface BookingFormData {
  client_name: string;
  phone: string;
  email: string;
  guests_amount: number;
  note: string;
  dates: string;
}
