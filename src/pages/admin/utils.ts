import i18next from "i18next";
import { useTranslation } from "react-i18next";

export function useMonthNames() {
  const { t } = useTranslation();
  return [
    t("january", "January"),
    t("february", "February"),
    t("march", "March"),
    t("april", "April"),
    t("may", "May"),
    t("june", "June"),
    t("july", "July"),
    t("august", "August"),
    t("september", "September"),
    t("october", "October"),
    t("november", "November"),
    t("december", "December"),
  ];
}

export function useDayLabels() {
  const { t } = useTranslation();
  return [
    t("mon", "Mon"),
    t("tue", "Tue"),
    t("wed", "Wed"),
    t("thu", "Thu"),
    t("fri", "Fri"),
    t("sat", "Sat"),
    t("sun", "Sun"),
  ];
}

export function clearTime(date: Date): Date {
  date.setHours(0, 0, 0, 0);
  return date;
}

export function formatDateTime(isoStr: string): string {
  const d = new Date(isoStr);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function dateKey(y: number, m: number, d: number): string {
  return i18next.t("yvalval2", "{{y}}-{{val}}-{{val2}}", {
    y,
    val: String(m + 1).padStart(2, "0"),
    val2: String(d).padStart(2, "0"),
  });
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  let day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}
