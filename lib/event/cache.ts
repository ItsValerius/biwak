import { cache } from "react";
import { getEventWithSlots } from "./service";

export const getCachedEventWithSlots = cache(getEventWithSlots);
