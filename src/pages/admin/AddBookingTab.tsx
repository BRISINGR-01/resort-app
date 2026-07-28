import { useState } from "react";
import BookingForm from "../../components/BookingForm";
import bookings from "../../data/bookings";
import type { BookingPayload } from "../../data/types";

export default function AddBookingTab() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );

  const handleSubmit = async (data: BookingPayload) => {
    setStatus("submitting");
    const result = await bookings.create(data);
    if (result.error) {
      setStatus("idle");
      return result;
    }
    setStatus("success");
    return result;
  };

  if (status === "success") {
    return (
      <div className="admin-tab-content">
        <div className="admin-success">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <h3>Booking Added</h3>
          <p>The booking has been created successfully.</p>
          <button
            className="admin-btn admin-btn-accept"
            onClick={() => setStatus("idle")}
          >
            Add Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-tab-content">
      <BookingForm
        idPrefix="add"
        className="admin-add-form"
        submitLabel="Create Booking"
        status={status}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
