import { randomUUID } from "node:crypto";
import { redis } from "./redis";

const HISTORY_KEY = "care:history";
const SCHEDULE_IDS_KEY = "care:schedules";
const SCHEDULE_KEY_PREFIX = "care:schedule:";

export type HistoryEntry =
  | {
      id: string;
      type: "medication";
      createdAt: number;
      medicationName: string;
      dosage?: string;
      note?: string;
      author?: string;
      scheduleId?: string;
    }
  | {
      id: string;
      type: "comment";
      createdAt: number;
      message: string;
      author?: string;
    };

export type HistoryEntryInput = {
  createdAt: number;
  author?: string;
} & (
  | {
      type: "medication";
      medicationName: string;
      dosage?: string;
      note?: string;
      scheduleId?: string;
    }
  | {
      type: "comment";
      message: string;
    }
);

export interface Schedule {
  id: string;
  medicationName: string;
  dosage?: string;
  frequencyMs: number;
  startAt: number;
  endAt?: number;
  lastTakenAt?: number;
  notes?: string;
}

export interface ScheduleWithComputed extends Schedule {
  nextDueAt: number;
}

const scheduleKey = (id: string) => `${SCHEDULE_KEY_PREFIX}${id}`;

export async function addHistoryEntry(entry: HistoryEntryInput) {
  const id = randomUUID();
  const record = { id, ...entry };
  await redis.zadd(HISTORY_KEY, entry.createdAt, JSON.stringify(record));
  return record as HistoryEntry;
}

export async function getHistory(limit = 100) {
  const entries = await redis.zrevrange(HISTORY_KEY, 0, limit - 1);
  return entries
    .map((raw) => {
      try {
        return JSON.parse(raw) as HistoryEntry;
      } catch {
        return null;
      }
    })
    .filter(Boolean) as HistoryEntry[];
}

export async function addSchedule(schedule: Omit<Schedule, "id">) {
  const id = randomUUID();
  const payload: Schedule = { ...schedule, id };
  await redis
    .multi()
    .sadd(SCHEDULE_IDS_KEY, id)
    .set(scheduleKey(id), JSON.stringify(payload))
    .exec();
  return payload;
}

export async function updateSchedule(schedule: Schedule) {
  await redis.set(scheduleKey(schedule.id), JSON.stringify(schedule));
  return schedule;
}

export async function getSchedules(): Promise<Schedule[]> {
  const ids = await redis.smembers(SCHEDULE_IDS_KEY);
  if (ids.length === 0) {
    return [];
  }

  const results = await redis.mget(ids.map((id) => scheduleKey(id)));
  return results
    .map((raw) => {
      if (!raw) return null;
      try {
        return JSON.parse(raw) as Schedule;
      } catch {
        return null;
      }
    })
    .filter(Boolean) as Schedule[];
}

export async function getScheduleById(id: string) {
  const raw = await redis.get(scheduleKey(id));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Schedule;
  } catch {
    return null;
  }
}

export async function deleteSchedule(id: string) {
  await redis
    .multi()
    .srem(SCHEDULE_IDS_KEY, id)
    .del(scheduleKey(id))
    .exec();
  return true;
}

export async function markDoseTaken(
  scheduleId: string,
  takenAt: number,
  options: {
    author?: string;
    note?: string;
  } = {},
) {
  const schedule = await getScheduleById(scheduleId);
  if (!schedule) {
    throw new Error("Schedule not found");
  }

  schedule.lastTakenAt = takenAt;
  await updateSchedule(schedule);

  await addHistoryEntry({
    type: "medication",
    medicationName: schedule.medicationName,
    dosage: schedule.dosage,
    createdAt: takenAt,
    note: options.note,
    author: options.author,
    scheduleId,
  });

  return schedule;
}

export function getNextDoseTimestamp(schedule: Schedule) {
  const { frequencyMs, startAt, lastTakenAt, endAt } = schedule;
  const now = Date.now();

  // If schedule has an end and we're already past it, nothing else is due
  if (endAt !== undefined && now > endAt) {
    return NaN;
  }

  let next: number;

  if (lastTakenAt === undefined) {
    // First dose logic: the next dose is the start time if still in the future
    if (now <= startAt) {
      next = startAt;
    } else {
      // We are past the start; advance in frequency steps until >= now
      const elapsed = now - startAt;
      const steps = Math.ceil(elapsed / frequencyMs);
      next = startAt + steps * frequencyMs;
    }
  } else {
    if (lastTakenAt >= now) {
      next = lastTakenAt + frequencyMs;
    } else {
      const elapsed = now - lastTakenAt;
      const steps = Math.ceil(elapsed / frequencyMs);
      next = lastTakenAt + steps * frequencyMs;
    }
  }

  // Respect endAt if present
  if (endAt !== undefined && next > endAt) {
    return NaN;
  }

  return next;
}
