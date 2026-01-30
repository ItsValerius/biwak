import type {
  ApiErrorResponse,
  GetEventResponse,
  ApiResult,
} from "./schemas";

const BASE = "";

async function parseJsonOrError<T>(response: Response): Promise<ApiResult<T>> {
  const body = (await response.json().catch(() => ({}))) as T | ApiErrorResponse;
  if (!response.ok) {
    const error = (body as ApiErrorResponse).error ?? response.statusText;
    return { ok: false, status: response.status, error };
  }
  return { ok: true, data: body as T };
}

/** GET /api/event – fetch event with slots (optionally by eventId). */
export async function fetchEvent(
  eventId?: string | null
): Promise<ApiResult<GetEventResponse>> {
  const url = eventId
    ? `${BASE}/api/event?eventId=${encodeURIComponent(eventId)}`
    : `${BASE}/api/event`;
  const response = await fetch(url);
  return parseJsonOrError<GetEventResponse>(response);
}
