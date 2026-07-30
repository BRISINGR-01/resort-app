import BookingForm from "../../components/BookingForm";
import bookings from "../../data/bookings";
import type { Booking, BookingPayload } from "../../data/types";
import { useTranslation } from "react-i18next";

interface EditBookingModalProps {
  booking: Booking | null;
  onClose: () => void;
  onSaved: () => void;
  onDeleted: () => void;
}

export default function EditBookingModal({
  booking,
  onClose,
  onSaved,
  onDeleted,
}: EditBookingModalProps) {
  const { t } = useTranslation();
  if (!booking) return null;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h3>{t("editBooking", "Edit Booking")}</h3>
          <button
            className="admin-modal-close"
            onClick={onClose}
            aria-label={t("close", "Close")}
          >
            &times;
          </button>
        </div>

        <div className="admin-modal-form">
          <BookingForm
            idPrefix="edit"
            submitLabel="Save Changes"
            deleteLabel="Delete"
            defaultValues={booking}
            onSubmit={async (data: BookingPayload) => {
              const result = await bookings.update(booking.id, data);

              if (!result.error) onSaved();
              return result;
            }}
            onDelete={async () => {
              const result = await bookings.remove(booking.id);

              if (!result.error) onDeleted();
              return result;
            }}
          />
        </div>
      </div>
    </div>
  );
}
