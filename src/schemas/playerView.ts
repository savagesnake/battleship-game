import { z } from 'zod';
import { PlacedShipSchema } from './ship';
import { ShotSchema } from './shot';

/**
 * Everything one player is allowed to see (SPEC §9.1). Scenes render this, never raw game state,
 * so the opponent's unsunk ships can't leak into the UI.
 */
export const PlayerViewSchema = z.object({
  fleet: z.array(PlacedShipSchema),
  incomingShots: z.array(ShotSchema),
  outgoingShots: z.array(ShotSchema),
  sunkEnemyShips: z.array(PlacedShipSchema),
});
export type PlayerView = z.infer<typeof PlayerViewSchema>;
