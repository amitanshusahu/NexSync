import { formatInTimeZone } from "date-fns-tz";

export function date(date: Date) {
  return formatInTimeZone(date, "Asia/Kolkata", 'yyyy-MM-dd HH:mm:ss zzz');
}

export function dateToday() {
  const date = new Date();
  return formatInTimeZone(date, "Asia/Kolkata", 'yyyy-MM-dd');
}