import { NextRequest } from "next/server";
import { getEventWithSlots } from "@/lib/event";
import { jsonError, jsonSuccess } from "@/lib/api";
import { HTTP_STATUS, ERROR_MESSAGE } from "@/lib/constants";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const eventId =
    request.nextUrl.searchParams.get("eventId") ??
    process.env.NEXT_PUBLIC_DEFAULT_EVENT_ID ??
    undefined;

  const result = await getEventWithSlots(eventId);

  if (!result) {
    return jsonError(ERROR_MESSAGE.NO_EVENT, HTTP_STATUS.NOT_FOUND);
  }

  return jsonSuccess(result);
}
