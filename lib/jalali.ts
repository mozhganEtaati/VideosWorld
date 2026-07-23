/**
 * Gregorian → Jalali (Persian) date conversion and Persian-digit helpers.
 * Self-contained (no external dependency). Algorithm per Kazimierz Borkowski.
 */

function div(a: number, b: number) {
  return Math.floor(a / b);
}

/** Convert a Gregorian y/m/d to Jalali [jy, jm, jd]. */
export function toJalali(gy: number, gm: number, gd: number): [number, number, number] {
  const gDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const jDaysInMonth = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

  let gy2 = gy - 1600;
  let gm2 = gm - 1;
  const gd2 = gd - 1;

  let gDayNo =
    365 * gy2 + div(gy2 + 3, 4) - div(gy2 + 99, 100) + div(gy2 + 399, 400);
  for (let i = 0; i < gm2; ++i) gDayNo += gDaysInMonth[i];
  if (gm2 > 1 && ((gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0)) gDayNo++;
  gDayNo += gd2;

  let jDayNo = gDayNo - 79;
  const jNp = div(jDayNo, 12053);
  jDayNo %= 12053;

  let jy = 979 + 33 * jNp + 4 * div(jDayNo, 1461);
  jDayNo %= 1461;

  if (jDayNo >= 366) {
    jy += div(jDayNo - 1, 365);
    jDayNo = (jDayNo - 1) % 365;
  }

  let jm = 0;
  for (let i = 0; i < 11 && jDayNo >= jDaysInMonth[i]; ++i) {
    jDayNo -= jDaysInMonth[i];
    jm++;
  }
  const jd = jDayNo + 1;
  return [jy, jm + 1, jd];
}

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/** Convert Latin digits in a string/number to Persian digits. */
export function toPersianDigits(value: string | number): string {
  return String(value).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
}

/** Format a TMDB ISO date (YYYY-MM-DD) as a Persian-digit Jalali date. */
export function formatJalali(iso: string | null | undefined): string {
  if (!iso) return "—";
  const parts = iso.split("-").map(Number);
  if (parts.length < 3 || parts.some(Number.isNaN)) return "—";
  const [jy, jm, jd] = toJalali(parts[0], parts[1], parts[2]);
  const pad = (n: number) => String(n).padStart(2, "0");
  return toPersianDigits(`${jy}/${pad(jm)}/${pad(jd)}`);
}

/** Extract the Gregorian year from an ISO date, or empty string. */
export function yearOf(iso: string | null | undefined): string {
  if (!iso) return "";
  return iso.slice(0, 4);
}
