import { HTTP_STATUS } from "@/lib/constants";

export function jsonSuccess<T>(data: T, status = HTTP_STATUS.OK) {
  return Response.json(data, { status });
}

export function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}
