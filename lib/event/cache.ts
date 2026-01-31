/**
 * Cached event fetchers – server only.
 * Uses React cache() and getEventWithSlots (db access).
 */
import "server-only";

import { cache } from "react";
import { getEventWithSlots } from "./service";

export const getCachedEventWithSlots = cache(getEventWithSlots);
