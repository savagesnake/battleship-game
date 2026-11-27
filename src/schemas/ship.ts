import { z } from 'zod';
import { CoordSchema } from './coord';

export const ShipNameSchema = z.enum(['Carrier', 'Battleship', 'Cruiser', 'Submarine', 'Destroyer']);
export type ShipName = z.infer<typeof ShipNameSchema>;

export const OrientationSchema = z.enum(['horizontal', 'vertical']);
export type Orientation = z.infer<typeof OrientationSchema>;

/** A ship on the board: `start` is its top-left cell; it extends right (horizontal) or down (vertical). */
export const PlacedShipSchema = z.object({
  name: ShipNameSchema,
  start: CoordSchema,
  orientation: OrientationSchema,
});
export type PlacedShip = z.infer<typeof PlacedShipSchema>;
