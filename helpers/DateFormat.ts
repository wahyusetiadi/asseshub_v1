// helpers/DateFormat.ts

/**
 * 🎯 FULL DATE & TIME
 * Input: "2026-01-06T14:30:00.000Z"
 * Output: "6 Jan 2026, 21:30"
 */
export const fullDateFormat = (
  dateInput: string | Date | undefined | null
): string => {
  if (!dateInput) return "-";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (isNaN(date.getTime())) {
    return "Format Tanggal Salah";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

/**
 * 🎯 DATE ONLY (Short)
 * Input: "2026-01-06T14:30:00.000Z"
 * Output: "6 Jan 2026"
 */
export const formatDateOnly = (
  dateInput: string | Date | undefined | null
): string => {
  if (!dateInput) return "-";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (isNaN(date.getTime())) {
    return "Format Tanggal Salah";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

/**
 * 🎯 DATE ONLY (Long)
 * Input: "2026-01-06T14:30:00.000Z"
 * Output: "6 Januari 2026"
 */
export const formatDateLong = (
  dateInput: string | Date | undefined | null
): string => {
  if (!dateInput) return "-";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (isNaN(date.getTime())) {
    return "Format Tanggal Salah";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

/**
 * 🎯 DATE WITH DAY NAME
 * Input: "2026-01-06T14:30:00.000Z"
 * Output: "Selasa, 6 Januari 2026"
 */
export const formatDateWithDay = (
  dateInput: string | Date | undefined | null
): string => {
  if (!dateInput) return "-";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (isNaN(date.getTime())) {
    return "Format Tanggal Salah";
  }

  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

/**
 * 🎯 TIME ONLY
 * Input: "2026-01-06T14:30:00.000Z"
 * Output: "21:30"
 */
export const formatTimeOnly = (
  dateInput: string | Date | undefined | null
): string => {
  if (!dateInput) return "-";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (isNaN(date.getTime())) {
    return "Format Waktu Salah";
  }

  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

/**
 * 🎯 TIME WITH SECONDS
 * Input: "2026-01-06T14:30:45.000Z"
 * Output: "21:30:45"
 */
export const formatTimeWithSeconds = (
  dateInput: string | Date | undefined | null
): string => {
  if (!dateInput) return "-";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (isNaN(date.getTime())) {
    return "Format Waktu Salah";
  }

  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
};

/**
 * 🎯 FULL DATE & TIME WITH SECONDS
 * Input: "2026-01-06T14:30:45.000Z"
 * Output: "6 Jan 2026, 21:30:45"
 */
export const fullDateTimeWithSeconds = (
  dateInput: string | Date | undefined | null
): string => {
  if (!dateInput) return "-";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (isNaN(date.getTime())) {
    return "Format Tanggal Salah";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
};

/**
 * 🎯 RELATIVE TIME (Berapa lama yang lalu)
 * Input: "2026-01-05T14:30:00.000Z"
 * Output: "1 hari yang lalu" / "2 jam yang lalu" / "Baru saja"
 */
export const formatRelativeTime = (
  dateInput: string | Date | undefined | null
): string => {
  if (!dateInput) return "-";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (isNaN(date.getTime())) {
    return "Format Tanggal Salah";
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) return "Baru saja";
  if (diffMin < 60) return `${diffMin} menit yang lalu`;
  if (diffHour < 24) return `${diffHour} jam yang lalu`;
  if (diffDay < 30) return `${diffDay} hari yang lalu`;
  if (diffMonth < 12) return `${diffMonth} bulan yang lalu`;
  return `${diffYear} tahun yang lalu`;
};

/**
 * 🎯 ISO FORMAT (For datetime-local input)
 * Input: "2026-01-06T14:30:00.000Z"
 * Output: "2026-01-06T21:30" (Local timezone)
 */
export const formatDateTimeLocal = (
  dateInput: string | Date | undefined | null
): string => {
  if (!dateInput) return "";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 16);
};

/**
 * 🎯 ISO DATE (For date input)
 * Input: "2026-01-06T14:30:00.000Z"
 * Output: "2026-01-06"
 */
export const formatDateInput = (
  dateInput: string | Date | undefined | null
): string => {
  if (!dateInput) return "";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
};

/**
 * 🎯 SHORT DATE (DD/MM/YYYY)
 * Input: "2026-01-06T14:30:00.000Z"
 * Output: "06/01/2026"
 */
export const formatDateShort = (
  dateInput: string | Date | undefined | null
): string => {
  if (!dateInput) return "-";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (isNaN(date.getTime())) {
    return "Format Tanggal Salah";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * 🎯 YEAR ONLY
 * Input: "2026-01-06T14:30:00.000Z"
 * Output: "2026"
 */
export const formatYear = (
  dateInput: string | Date | undefined | null
): string => {
  if (!dateInput) return "-";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (isNaN(date.getTime())) {
    return "Format Tanggal Salah";
  }

  return date.getFullYear().toString();
};

/**
 * 🎯 MONTH & YEAR
 * Input: "2026-01-06T14:30:00.000Z"
 * Output: "Januari 2026"
 */
export const formatMonthYear = (
  dateInput: string | Date | undefined | null
): string => {
  if (!dateInput) return "-";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (isNaN(date.getTime())) {
    return "Format Tanggal Salah";
  }

  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(date);
};

/**
 * 🎯 DATE RANGE
 * Input: start="2026-01-06", end="2026-01-10"
 * Output: "6 Jan - 10 Jan 2026"
 */
export const formatDateRange = (
  startDate: string | Date | undefined | null,
  endDate: string | Date | undefined | null
): string => {
  if (!startDate || !endDate) return "-";

  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return "Format Tanggal Salah";
  }

  const startStr = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
  }).format(start);

  const endStr = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(end);

  return `${startStr} - ${endStr}`;
};

/**
 * 🎯 BACKWARD COMPATIBILITY (alias untuk fullDateFormat)
 */
export const formatDate = fullDateFormat;
