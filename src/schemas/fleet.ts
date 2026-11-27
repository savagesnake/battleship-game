import { z } from 'zod';
import { isCompleteFleet } from '../game/fleet';
import { isInBounds, isValidFleet } from '../game/placement';
import { PlacedShipSchema } from './ship';

/** A complete, legally placed fleet: one of each ship (§4.1), all on the board and not overlapping (§4.2). */
export const FleetSchema = z.array(PlacedShipSchema).superRefine((fleet, ctx) => {
  if (!isCompleteFleet(fleet)) {
    ctx.addIssue({ code: 'custom', message: 'Fleet must contain exactly one of each ship' });
    return;
  }
  fleet.forEach((ship, index) => {
    if (!isInBounds(ship)) ctx.addIssue({ code: 'custom', message: `${ship.name} is off the board`, path: [index] });
  });
  if (fleet.every(isInBounds) && !isValidFleet(fleet)) {
    ctx.addIssue({ code: 'custom', message: 'Ships overlap' });
  }
});

export type Fleet = z.infer<typeof FleetSchema>;
