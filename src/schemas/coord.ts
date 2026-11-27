import { z } from 'zod';
import { BOARD_SIZE } from '../game/constants';

const cellIndex = z.number().int().min(0).max(BOARD_SIZE - 1);

/** Zero-based board cell (SPEC §3). */
export const CoordSchema = z.object({
  row: cellIndex,
  col: cellIndex,
});

export type Coord = z.infer<typeof CoordSchema>;
