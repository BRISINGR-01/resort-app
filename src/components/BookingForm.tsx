import { useState, useEffect } from "react";
import { useForm, type UseFormSetValue } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import { isValidPhoneNumber, type CountryCode } from "libphonenumber-js";
import DatePicker from "./DatePicker";
import type { Booking, BookingPayload, SupabaseResponse } from "../data/types";
import { useTranslation } from "react-i18next";
import useInfo from "../data/information";

function toDateString(date: Date | null | undefined): string {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseDate(str: string | null | undefined): Date | null {
  if (!str) return null;
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function parsePhone(phone: string | null | undefined): string {
  return phone?.replace(/^\+/, "") ?? "";
}

interface DefaultValues {
  client_name: string;
  phone: string | null;
  email: string;
  start_date: Date | null;
  end_date: Date | null;
  guests_amount: number;
  note: string;
  dates: string;
}

function toDate(val: string | Date | null | undefined): Date | null {
  if (!val) return null;
  if (val instanceof Date) return val;
  return parseDate(val);
}

const DEFAULTS: DefaultValues = {
  client_name: "",
  phone: "359",
  email: "",
  start_date: null,
  end_date: null,
  guests_amount: 1,
  note: "",
  dates: "",
};

export interface BookingFormProps {
  idPrefix?: string;
  nameLabel?: string;
  submitLabel?: string;
  className?: string;
  showEmail?: boolean;
  showPhone?: boolean;
  showNote?: boolean;
  noteTextarea?: boolean;
  guestCounter?: boolean;
  defaultValues?: Partial<Booking>;
  onSubmit: (data: BookingPayload) => Promise<SupabaseResponse<any> | void>;
  onDelete?: () => Promise<SupabaseResponse<any>>;
  deleteLabel?: string;
  status?: string;
}

export default function BookingForm({
  idPrefix = "bf",
  nameLabel = "Full Name",
  submitLabel = "Submit",
  className = "",
  defaultValues,
  onSubmit,
  onDelete,
  deleteLabel = "Delete",
  status: externalStatus,
}: BookingFormProps) {
  const { t } = useTranslation();
  const init = { ...DEFAULTS, ...defaultValues };

  const [dates, setDates] = useState<[Date | null, Date | null]>(() => [
    toDate(init.start_date),
    toDate(init.end_date),
  ]);
  const [phone, setPhone] = useState(parsePhone(init.phone));
  const [phoneCountry, setPhoneCountry] = useState("bg");
  const [internalStatus, setInternalStatus] = useState("idle");
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const status = externalStatus ?? internalStatus;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: init,
  });

  const guestsAmount = watch("guests_amount");

  const resetState = () => {
    const merged = { ...DEFAULTS, ...defaultValues };
    reset(merged);

    const parsed = parsePhone(merged.phone);
    setPhone(parsed);
    setPhoneCountry("bg");
    setValue("phone", parsed, { shouldValidate: true });

    handleDateChange(
      toDate(defaultValues?.start_date ?? null),
      toDate(defaultValues?.end_date ?? null),
    );

    setInternalStatus("idle");
    setError("");
    setConfirmDelete(false);
  };

  useEffect(() => {
    if (defaultValues) resetState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues, reset, setValue]);

  const handleDateChange = (ci: Date | null, co: Date | null) => {
    setDates([ci, co]);
    setValue(
      "dates",
      ci && co
        ? t("valval2", "{{val}}-{{val2}}", {
            val: toDateString(ci),
            val2: toDateString(co),
          })
        : "",
      { shouldValidate: true },
    );
  };

  const submit = async (data: any) => {
    setError("");
    const startDate = dates[0];
    const endDate = dates[1];

    if (!data.client_name?.trim()) return setError("Client name is required");
    if (!phone || phone.length < 5) return setError("Phone number is required");
    if (
      !isValidPhoneNumber(
        `+${phone}`,
        phoneCountry.toUpperCase() as CountryCode,
      )
    )
      return setError("Enter a valid phone number");
    if (!startDate) return setError("Check-in date is required");
    if (!endDate) return setError("Check-out date is required");
    if (startDate >= endDate)
      return setError("Check-out must be after check-in");
    if ((data.guests_amount || 0) < 1)
      return setError("At least 1 guest required");

    const payload: BookingPayload = {
      client_name: data.client_name.trim(),
      start_date: startDate,
      end_date: endDate,
      guests_amount: Number(data.guests_amount),
      note: data.note?.trim() || null,
      phone: `+${phone}`,
      email: data.email?.trim() || null,
    };

    if (externalStatus === undefined) setInternalStatus("submitting");
    try {
      const result = await onSubmit(payload);
      if (result?.error) {
        setError(result.error.message || "Something went wrong");
        if (externalStatus === undefined) setInternalStatus("idle");
      } else {
        resetState();
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      if (externalStatus === undefined) setInternalStatus("idle");
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setInternalStatus("deleting");
    const result = await onDelete();
    if (result?.error) {
      setError(result.error.message || "Failed to delete");
      setInternalStatus("idle");
      setConfirmDelete(false);
    }
  };

  const p = (name: string) =>
    t("idprefixname", "{{idPrefix}}-{{name}}", { idPrefix, name });

  return (
    <form
      className={"booking-form " + className}
      onSubmit={handleSubmit(submit)}
      noValidate
    >
      {error && <div className="admin-form-error">{error}</div>}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor={p("name")}>{nameLabel}</label>
          <input
            type="text"
            id={p("name")}
            placeholder={"John Smith"}
            className={errors.client_name ? "input-error" : ""}
            {...register("client_name", {
              required: t("nameIsRequired", "Name is required"),
              minLength: {
                value: 2,
                message: t(
                  "nameMustBeAtLeast2Characters",
                  "Name must be at least 2 characters",
                ),
              },
            })}
          />
          {errors.client_name && (
            <span className="form-error">{errors.client_name.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor={p("email")}>{t("email", "Email")}</label>
          <input
            type="email"
            id={p("email")}
            placeholder="john@example.com"
            className={errors.email ? "input-error" : ""}
            {...register("email", {
              required: false,
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: t(
                  "enterAValidEmailAddress",
                  "Enter a valid email address",
                ),
              },
            })}
          />
          {errors.email && (
            <span className="form-error">{errors.email.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor={p("phone")}>{t("phoneNumber", "Phone Number")}</label>
          <PhoneInput
            country={phoneCountry}
            value={phone}
            onChange={(value: string, countryData: { countryCode: string }) => {
              setPhone(value);
              setPhoneCountry(countryData.countryCode);
              setValue("phone", value, { shouldValidate: true });
            }}
            inputProps={{
              name: "phone",
              id: p("phone"),
            }}
          />
          <input
            type="hidden"
            {...register("phone", {
              required: false,
              validate: (value: string | null) =>
                value
                  ? isValidPhoneNumber(
                      `+${value}`,
                      phoneCountry.toUpperCase() as CountryCode,
                    ) ||
                    t("enterAValidPhoneNumber", "Enter a valid phone number")
                  : true,
            })}
            value={phone}
          />
          {errors.phone && (
            <span className="form-error">{errors.phone.message}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor={p("guests_amount")}>{t("guests", "Guests")}</label>
          <GuestCounter
            id={p("guests_amount")}
            value={guestsAmount}
            setValue={setValue}
          />
          {errors.guests_amount && (
            <span className="form-error">{errors.guests_amount.message}</span>
          )}
        </div>
      </div>

      <div>
        <label>{t("dates", "Dates")}</label>
        <DatePicker
          prevoiuslySelected={[init.start_date, init.end_date]}
          defaultVal={dates}
          onDateChange={handleDateChange}
        />
        <input
          type="hidden"
          {...register("dates", {
            required: t(
              "bothCheckinAndCheckoutDatesAreRequired",
              "Both check-in and check-out dates are required",
            ),
          })}
        />
        {errors.dates && (
          <span className="form-error">{errors.dates.message}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor={p("note")}>
          {t("noteOptional", "Note (optional)")}
        </label>
        <textarea
          id={p("note")}
          placeholder={t(
            "tellUsAboutYourDreamVacation",
            "Tell us about your dream vacation...",
          )}
          className={errors.note ? "input-error" : ""}
          {...register("note")}
        />
      </div>

      {(onDelete || externalStatus === undefined) && (
        <div className="admin-modal-actions">
          {onDelete && (
            <div className="admin-modal-actions-left">
              {!confirmDelete ? (
                <button
                  type="button"
                  className="admin-btn admin-btn-delete"
                  onClick={() => setConfirmDelete(true)}
                >
                  {deleteLabel}
                </button>
              ) : (
                <div className="admin-delete-confirm">
                  <button
                    type="button"
                    className="admin-btn admin-btn-delete-confirm"
                    onClick={handleDelete}
                    disabled={status === "deleting"}
                  >
                    {status === "deleting" ? (
                      <span className="btn-spinner" />
                    ) : (
                      t("yesDelete", "Yes, delete")
                    )}
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-cancel"
                    onClick={() => setConfirmDelete(false)}
                  >
                    {t("cancel", "Cancel")}
                  </button>
                </div>
              )}
            </div>
          )}
          <div className="admin-modal-actions-right">
            <button
              type="submit"
              className="admin-btn admin-btn-accept"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? (
                <span className="btn-spinner" />
              ) : (
                submitLabel
              )}
            </button>
          </div>
        </div>
      )}

      {submitLabel && (
        <button
          type="submit"
          className="btn btn-primary btn-full"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? (
            <span className="btn-spinner" />
          ) : (
            submitLabel
          )}
        </button>
      )}
    </form>
  );
}

interface GuestCounterProps {
  id: string;
  value: number;
  setValue: UseFormSetValue<any>;
}

function GuestCounter({ value, setValue }: GuestCounterProps) {
  const count = value || 1;
  const { maxGuests } = useInfo();

  return (
    <div className="guest-selector">
      <button
        type="button"
        className="guest-btn"
        onClick={() =>
          setValue("guests_amount", Math.max(1, count - 1), {
            shouldValidate: true,
          })
        }
      >
        −
      </button>
      <span className="guest-count">{count}</span>
      <button
        type="button"
        className="guest-btn"
        onClick={() =>
          setValue("guests_amount", Math.min(maxGuests, count + 1), {
            shouldValidate: true,
          })
        }
      >
        +
      </button>
    </div>
  );
}
