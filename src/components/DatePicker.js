import { useState } from "react";
import DatePickerLibrary from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { availability } from "../data";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function buildDateMap() {
  const map = {};
  for (const entry of availability) {
    const [monthName, yearStr] = entry.month.split(" ");
    const monthNum = MONTH_NAMES.indexOf(monthName);
    const year = parseInt(yearStr);
    entry.days.forEach((status, i) => {
      const d = new Date(year, monthNum, i + 1);
      const key = d.toISOString().slice(0, 10);
      map[key] = status;
    });
  }
  return map;
}

const dateMap = buildDateMap();

function dateToKey(date) {
  return date.toISOString().slice(0, 10);
}

function formatShort(date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DatePicker({ defaultVal, onDateChange }) {
  const [checkIn, setCheckIn] = useState(defaultVal[0] ?? null);
  const [checkOut, setCheckOut] = useState(defaultVal[1] ?? null);
  const [selecting, setSelecting] = useState("checkin");
  const [open, setOpen] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const bookedDates = [];
  const limitedKeys = new Set();

  for (const entry of availability) {
    const [monthName, yearStr] = entry.month.split(" ");
    const monthNum = MONTH_NAMES.indexOf(monthName);
    const year = parseInt(yearStr);
    entry.days.forEach((status, i) => {
      const d = new Date(year, monthNum, i + 1);
      if (status === "booked") bookedDates.push(d);
      else if (status === "limited") limitedKeys.add(dateToKey(d));
    });
  }

  const handleChange = (date) => {
    if (selecting === "checkin") {
      setCheckIn(date);
      setCheckOut(null);
      setSelecting("checkout");
      onDateChange?.(date, null);
    } else {
      if (date <= checkIn) {
        setCheckIn(date);
        setCheckOut(null);
        setSelecting("checkout");
        onDateChange?.(date, null);
      } else {
        setCheckOut(date);
        setSelecting("checkin");
        onDateChange?.(checkIn, date);
      }
    }
  };

  const clearDates = (e) => {
    e.stopPropagation();
    setCheckIn(null);
    setCheckOut(null);
    setSelecting("checkin");
    onDateChange?.(null, null);
  };

  const displayText = checkIn
    ? checkOut
      ? `${formatShort(checkIn)} - ${formatShort(checkOut)}`
      : `${formatShort(checkIn)} - Select checkout`
    : "Select check-in date";

  const isInRange = (date) => {
    if (!checkIn || !checkOut) return false;
    return date > checkIn && date < checkOut;
  };

  const isSelected = (date) => {
    if (checkIn && date.getTime() === checkIn.getTime()) return true;
    if (checkOut && date.getTime() === checkOut.getTime()) return true;
    return false;
  };

  const dayClassName = (date) => {
    if (isSelected(date)) return "rdp-selected-day";
    if (isInRange(date)) return "rdp-in-range";
    if (dateMap[dateToKey(date)] === "booked") return "rdp-booked-day";
    return "";
  };

  const CustomInput = ({ onClick }) => (
    <div className="rdp-display" onClick={onClick}>
      <svg
        className="rdp-display-icon"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
      <span className={`rdp-display-text ${!checkIn ? "rdp-placeholder" : ""}`}>
        {displayText}
      </span>
      {checkIn && (
        <button
          className="rdp-clear"
          onClick={clearDates}
          aria-label="Clear dates"
        >
          &times;
        </button>
      )}
    </div>
  );

  return (
    <div className={`rdp-wrapper ${open ? "rdp-wrapper--open" : ""}`}>
      <DatePickerLibrary
        onChange={handleChange}
        customInput={<CustomInput />}
        open={open}
        onCalendarOpen={() => setOpen(true)}
        onClickOutside={() => setOpen(false)}
        monthsShown={1}
        minDate={today}
        excludeDates={bookedDates}
        dayClassName={dayClassName}
        calendarClassName="rdp-calendar"
        showPopperArrow={false}
        fixedHeader
        allowSameDay
      />
    </div>
  );
}
