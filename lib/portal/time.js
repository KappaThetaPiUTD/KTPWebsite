const CENTRAL_TIME_ZONE = "America/Chicago";

const dateTimeFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: CENTRAL_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

function centralParts(timestamp) {
  return Object.fromEntries(
    dateTimeFormatter
      .formatToParts(new Date(timestamp))
      .filter(({ type }) => type !== "literal")
      .map(({ type, value }) => [type, Number(value)])
  );
}

function partsAsUtc(parts) {
  return Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour || 0,
    parts.minute || 0,
    parts.second || 0
  );
}

/** Convert a datetime-local wall time in US Central into a UTC instant. */
export function parseCentralDateTime(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(value);
  if (!match) return null;

  const [, year, month, day, hour, minute, second = "0"] = match;
  const target = {
    year: Number(year),
    month: Number(month),
    day: Number(day),
    hour: Number(hour),
    minute: Number(minute),
    second: Number(second),
  };
  const wallTimestamp = partsAsUtc(target);
  if (new Date(wallTimestamp).toISOString().slice(0, 19) !== `${year}-${month}-${day}T${hour}:${minute}:${second.padStart(2, "0")}`) {
    return null;
  }

  let timestamp = wallTimestamp;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const actual = centralParts(timestamp);
    const adjustment = wallTimestamp - partsAsUtc(actual);
    if (adjustment === 0) break;
    timestamp += adjustment;
  }

  const resolved = centralParts(timestamp);
  if (partsAsUtc(resolved) !== wallTimestamp) return null;
  return new Date(timestamp);
}

export function centralDateTimeParts(timestamp) {
  return centralParts(timestamp);
}

/** Add calendar days while retaining the Central wall-clock time. */
export function addCentralDays(date, days) {
  const parts = centralParts(date.getTime());
  const localDate = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + days));
  const value = `${localDate.getUTCFullYear()}-${String(localDate.getUTCMonth() + 1).padStart(2, "0")}-${String(localDate.getUTCDate()).padStart(2, "0")}T${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}:${String(parts.second).padStart(2, "0")}`;
  return parseCentralDateTime(value);
}

/** Add calendar months, clamping to the last day of the destination month. */
export function addCentralMonths(date, months) {
  const parts = centralParts(date.getTime());
  const firstOfMonth = new Date(Date.UTC(parts.year, parts.month - 1 + months, 1));
  const lastDay = new Date(Date.UTC(firstOfMonth.getUTCFullYear(), firstOfMonth.getUTCMonth() + 1, 0)).getUTCDate();
  const day = Math.min(parts.day, lastDay);
  const value = `${firstOfMonth.getUTCFullYear()}-${String(firstOfMonth.getUTCMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}:${String(parts.second).padStart(2, "0")}`;
  return parseCentralDateTime(value);
}

export function parseCentralDateEnd(value) {
  return parseCentralDateTime(`${value}T23:59:59`);
}
