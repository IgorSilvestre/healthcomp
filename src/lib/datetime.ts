export const APP_TIME_ZONE = "America/Sao_Paulo";

const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const DATE_TIME_REGEX =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?$/;

const dateTimeFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: APP_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: APP_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

type FormatterParts = Record<string, string>;

function getParts(
  formatter: Intl.DateTimeFormat,
  value: number,
): FormatterParts {
  return formatter
    .formatToParts(new Date(value))
    .reduce<Record<string, string>>((acc, part) => {
      if (part.type !== "literal") {
        acc[part.type] = part.value;
      }
      return acc;
    }, {});
}

function getTimeZoneOffset(date: Date, timeZone: string) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = dtf
    .formatToParts(date)
    .reduce<Record<string, string>>((acc, part) => {
      if (part.type !== "literal") {
        acc[part.type] = part.value;
      }
      return acc;
    }, {});
  const asUTC = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );
  const diffMs = asUTC - date.getTime();
  return diffMs / 60000;
}

function zonedDateTimeToUtc(value: string, timeZone: string) {
  const [datePart, timePart = "00:00"] = value.split("T");
  const [year, month, day] = datePart.split("-").map((v) => Number(v));
  const [timeComponent, fractionComponent] = timePart.split(".");
  const [hour = "00", minute = "00", second = "00"] = (
    timeComponent || "00:00"
  ).split(":");
  const millisecond = fractionComponent
    ? Number(fractionComponent.padEnd(3, "0"))
    : 0;

  const utcDate = new Date(
    Date.UTC(
      year,
      (month || 1) - 1,
      day || 1,
      Number(hour),
      Number(minute),
      Number(second),
      millisecond,
    ),
  );

  const offset = getTimeZoneOffset(utcDate, timeZone);
  return utcDate.getTime() - offset * 60_000;
}

export function parseInAppTimeZone(
  value: string,
  options?: { endOfDay?: boolean },
) {
  const trimmed = value.trim();
  if (!trimmed) {
    return Date.now();
  }

  if (DATE_ONLY_REGEX.test(trimmed)) {
    const suffix = options?.endOfDay ? "T23:59:59.999" : "T00:00";
    return zonedDateTimeToUtc(`${trimmed}${suffix}`, APP_TIME_ZONE);
  }

  if (DATE_TIME_REGEX.test(trimmed)) {
    return zonedDateTimeToUtc(trimmed, APP_TIME_ZONE);
  }

  const numeric = Number(trimmed);
  if (Number.isFinite(numeric)) {
    return numeric;
  }

  const parsed = Date.parse(trimmed);
  return Number.isNaN(parsed) ? Date.now() : parsed;
}

export function formatDateTime(
  value: number,
  locale: string | string[] = "default",
) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: APP_TIME_ZONE,
  }).format(new Date(value));
}

export function toAppDateTimeInputValue(value: number) {
  const parts = getParts(dateTimeFormatter, value);
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

export function toAppDateInputValue(value: number) {
  const parts = getParts(dateFormatter, value);
  return `${parts.year}-${parts.month}-${parts.day}`;
}
