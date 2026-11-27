import { z } from 'zod';
import { FleetSchema } from './fleet';
import { GameModeSchema } from './gameMode';

/** What Placement hands to Battle when the player presses Ready. */
export const GameSetupSchema = z.object({
  mode: GameModeSchema,
  playerFleet: FleetSchema,
  computerFleet: FleetSchema,
});
export type GameSetup = z.infer<typeof GameSetupSchema>;
