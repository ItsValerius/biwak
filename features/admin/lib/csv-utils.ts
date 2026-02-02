import { parseBerlinDateTimeLocalToIso } from "@/features/events/lib/date-utils";

/** Parse CSV with header "name, time". Time can be "HH:mm", "HH:mm:ss", or full ISO. Base date is "YYYY-MM-DD" in German local time. */
export function parseScheduleCsv(
  csvText: string,
  baseDateStr: string
): { slots: { clubName: string; plannedStart: string }[]; error?: string } {
  const lines = csvText
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length < 2) {
    return { slots: [], error: "CSV must have a header row and at least one data row." };
  }

  const headerCells = parseCsvLine(lines[0]!).map((c) =>
    c.trim().replace(/^"|"$/g, "").toLowerCase()
  );
  const nameIdx = headerCells.indexOf("name");
  const timeIdx = headerCells.indexOf("time");
  if (nameIdx < 0 || timeIdx < 0) {
    return { slots: [], error: 'CSV header must include "name" and "time" columns.' };
  }

  const slots: { clubName: string; plannedStart: string }[] = [];
  const clean = (s: string) => s.trim().replace(/^"|"$/g, "").trim();
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]!;
    const cells = parseCsvLine(line);
    const name = clean(cells[nameIdx] ?? "");
    const timeStr = clean(cells[timeIdx] ?? "");
    if (!name) continue;
    const plannedStart = parseTimeToIso(timeStr, baseDateStr);
    if (!plannedStart) {
      return {
        slots: [],
        error: `Row ${i + 1}: invalid time "${timeStr}". Use HH:mm, HH:mm:ss, or full date/time.`,
      };
    }
    slots.push({ clubName: name, plannedStart });
  }
  if (slots.length === 0) {
    return { slots: [], error: "No valid rows found. Each row needs a name and a time." };
  }
  return { slots };
}

export function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (inQuotes) {
      current += c;
    } else if (c === ",") {
      result.push(current);
      current = "";
    } else {
      current += c;
    }
  }
  result.push(current);
  return result;
}

export function parseTimeToIso(value: string, baseDateStr: string): string | null {
  const v = value.trim();
  if (!v) return null;
  const timeOnly = v.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\s*([ap]m))?$/i);
  if (timeOnly) {
    let h = parseInt(timeOnly[1]!, 10);
    const m = parseInt(timeOnly[2]!, 10);
    const s = parseInt(timeOnly[3] ?? "0", 10);
    const pm = (timeOnly[4] ?? "").toLowerCase() === "pm";
    const am = (timeOnly[4] ?? "").toLowerCase() === "am";
    if (pm && h < 12) h += 12;
    if (am && h === 12) h = 0;
    const timePart = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    const dateTimeLocal = `${baseDateStr}T${timePart}`;
    const iso = parseBerlinDateTimeLocalToIso(dateTimeLocal);
    return iso || null;
  }
  const asDate = new Date(v);
  if (!Number.isNaN(asDate.getTime())) return asDate.toISOString();
  return null;
}
