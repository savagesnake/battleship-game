import { z } from 'zod';
import { BOARD_SIZE } from '../theme';

const cellIndex = z.number().int().min(0).max(BOARD_SIZE - 1);

/** Zero-based board cell (SPEC §3). */
export const CoordSchema = z.object({
  row: cellIndex,
  col: cellIndex,
});

export type Coord = z.infer<typeof CoordSchema>;
