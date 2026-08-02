import BookingForm from "../../components/BookingForm";
import bookings from "../../data/bookings";
import type { BookingPayload } from "../../data/types";
import { useTranslation } from "react-i18next";
import { useToast } from "../../components/Toast";

interface AddBookingModalProps {
  start: Date;
  end: Date;
  onClose: () => void;
  onSaved: () => void;
}

export default function AddBookingModal({
  start,
  end,
  onClose,
  onSaved,
}: AddBookingModalProps) {
  const { t } = useTranslation();
  const { toastError, toastSuccess } = useToast();

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h3>{t("addBooking", "Add Booking")}</h3>
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
            idPrefix="quickadd"
            submitLabel={t("createBooking", "Create Booking")}
            defaultValues={{
              start_date: start,
              end_date: end,
            }}
            onSubmit={async (data: BookingPayload) => {
              const result = await bookings.create(data);
              if (!result.error) {
                toastSuccess(t("bookingAdded", "Booking Added"));
                onSaved();
              } else {
                toastError(
                  result.error.message ||
                    t("failedToCreateBooking", "Failed to create booking"),
                );
              }
              return result;
            }}
          />
        </div>
      </div>
    </div>
  );
}
