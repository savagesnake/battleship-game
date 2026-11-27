import { z } from 'zod';

/** Game modes from SPEC §2. Passed between scenes and later stored in game state. */
export const GameModeSchema = z.enum(['vsComputer', 'vsPlayer']);

export type GameMode = z.infer<typeof GameModeSchema>;
