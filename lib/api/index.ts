/**
 * HTTP client for the event API endpoint.
 * Use fetchEvent() in client components to poll event data.
 */
export { jsonSuccess, jsonError } from "./response";
export {
  getEventResponseSchema,
  type GetEventResponse,
  type ApiErrorResponse,
  type ApiResult,
} from "./schemas";
export { fetchEvent } from "./client";
