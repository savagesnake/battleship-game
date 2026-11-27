import { z } from 'zod';
import { CoordSchema } from './coord';

export const ShotResultSchema = z.enum(['hit', 'miss']);
export type ShotResult = z.infer<typeof ShotResultSchema>;

export const ShotSchema = z.object({
  coord: CoordSchema,
  result: ShotResultSchema,
});
export type Shot = z.infer<typeof ShotSchema>;
