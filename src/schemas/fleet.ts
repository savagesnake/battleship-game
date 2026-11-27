import { z } from 'zod';
import { isCompleteFleet } from '../game/fleet';
import { PlacedShipSchema } from './ship';

/**
 * A complete fleet: exactly one of each ship from SPEC §4.1.
 * Checks composition only; bounds and overlap are placement rules (§4.2).
 */
export const FleetSchema = z
  .array(PlacedShipSchema)
  .refine(isCompleteFleet, { message: 'Fleet must contain exactly one of each ship' });

export type Fleet = z.infer<typeof FleetSchema>;
