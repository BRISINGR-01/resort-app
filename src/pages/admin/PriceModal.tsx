import { useState } from "react";
import prices from "../../data/prices";
import type { PricesData } from "../../data/types";
import { useTranslation } from "react-i18next";
import { formatDate } from "./utils";
import { useToast } from "../../components/Toast";

interface PriceModalProps {
  dates: Date[];
  dayPrices: PricesData[];
  defaultPrice: number;
  onClose: () => void;
  onSaved: () => void;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function PriceModal({
  dates,
  dayPrices,
  defaultPrice,
  onClose,
  onSaved,
}: PriceModalProps) {
  const { t } = useTranslation();
  const { toastError, toastSuccess } = useToast();
  const [price, setPrice] = useState<string>(() => {
    const existing = dayPrices.find((p) => isSameDay(p.date, dates[0]));
    return String(existing?.price ?? defaultPrice ?? "");
  });
  const [saving, setSaving] = useState(false);

  const first = dates[0];
  const last = dates[dates.length - 1];

  const handleSave = async () => {
    const value = Number(price);
    if (!Number.isFinite(value) || value < 0) {
      toastError(t("enterAValidPrice", "Enter a valid price"));
      return;
    }

    setSaving(true);
    for (const date of dates) {
      const err = await prices.setPrice(value, date);
      if (err) {
        toastError(
          err.message || t("failedToSavePrices", "Failed to save prices"),
        );
        setSaving(false);
        return;
      }
    }
    toastSuccess(
      t("pricesUpdated", "Prices updated for {{count}} day(s)", {
        count: dates.length,
      }),
    );
    onSaved();
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h3>{t("editPrices", "Edit Prices")}</h3>
          <button
            className="admin-modal-close"
            onClick={onClose}
            aria-label={t("close", "Close")}
          >
            &times;
          </button>
        </div>

        <div className="admin-modal-form">
          <p className="price-modal-range">
            {formatDate(first)}
            {dates.length > 1 && <> — {formatDate(last)}</>}
            <span className="price-modal-count">
              {" "}
              ({t("daysCount", "{{count}} days", { count: dates.length })})
            </span>
          </p>

          <div className="form-group">
            <label htmlFor="price-input">
              {t("pricePerNight", "Price per night")} (€)
            </label>
            <input
              id="price-input"
              type="number"
              min="0"
              step="1"
              className="price-modal-input"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="admin-modal-actions">
            <div className="admin-modal-actions-right">
              <button
                type="button"
                className="admin-btn admin-btn-cancel"
                onClick={onClose}
              >
                {t("cancel", "Cancel")}
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-accept"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <span className="btn-spinner" />
                ) : (
                  t("savePrices", "Save Prices")
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
